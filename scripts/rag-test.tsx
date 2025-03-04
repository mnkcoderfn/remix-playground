import fs from 'fs';
import path from 'path';
import { encode } from 'gpt-tokenizer';
import PDFParser from 'pdf2json';
import { PDFDocument } from 'pdf-lib';

// Function to read and parse a PDF file
async function readPDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData.parserError);
    });
    
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      // Extract text from PDF data
      const text = pdfData.Pages
        .map((page: any) => 
          page.Texts
            .map((textItem: any) => 
              textItem.R
                .map((r: any) => decodeURIComponent(r.T))
                .join('')
            )
            .join(' ')
        )
        .join('\n');
      
      resolve(text);
    });
    
    pdfParser.loadPDF(filePath);
  });
}

// Function to get PDF data with page information
async function getPDFData(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData.parserError);
    });
    
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      resolve(pdfData);
    });
    
    pdfParser.loadPDF(filePath);
  });
}

// Function to extract text from a page
function extractTextFromPage(page: any): string {
  return page.Texts
    .map((textItem: any) => 
      textItem.R
        .map((r: any) => decodeURIComponent(r.T))
        .join('')
    )
    .join(' ');
}

// Function to count tokens using GPT tokenizer
function countTokens(text: string): number {
  const tokens = encode(text);
  return tokens.length;
}

// Function to create PDF chunks using pdf-lib
async function createPDFChunks(pdfPath: string, outputDir: string, chunkSize: number = 5): Promise<string[]> {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Load the PDF document
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();
  
  // Get PDF data for text extraction and token counting
  const pdfData = await getPDFData(pdfPath);
  
  const chunkPaths: string[] = [];
  
  // Process pages in chunks
  for (let i = 0; i < totalPages; i += chunkSize) {
    const startPage = i;
    const endPage = Math.min(i + chunkSize, totalPages);
    
    // Create a new PDF document for this chunk
    const chunkDoc = await PDFDocument.create();
    
    // Copy the pages from the original document
    const copiedPages = await chunkDoc.copyPages(pdfDoc, Array.from(
      { length: endPage - startPage }, (_, j) => startPage + j
    ));
    
    // Add the copied pages to the chunk document
    copiedPages.forEach(page => chunkDoc.addPage(page));
    
    // Save the chunk document
    const chunkFileName = `chunk_${Math.floor(i / chunkSize) + 1}_pages_${startPage + 1}_to_${endPage}.pdf`;
    const chunkPath = path.join(outputDir, chunkFileName);
    
    const chunkBytes = await chunkDoc.save();
    fs.writeFileSync(chunkPath, chunkBytes);
    chunkPaths.push(chunkPath);
    
    // Get text from these pages for token counting
    const chunkText = pdfData.Pages.slice(i, i + chunkSize)
      .map(extractTextFromPage)
      .join('\n\n');
    
    console.log(`Created chunk: ${chunkFileName} (${countTokens(chunkText)} tokens)`);
  }
  
  return chunkPaths;
}

// Main function
async function main() {
  const pdfPath = path.join(process.cwd(), '<path-to-your-pdf>.pdf');
  const outputDir = path.join(process.cwd(), 'pdf-chunks');
  
  try {
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      console.error(`File not found: ${pdfPath}`);
      process.exit(1);
    }
    
    console.log(`Reading PDF file: ${pdfPath}`);
    
    // Get PDF data for token counting
    const pdfData = await getPDFData(pdfPath);
    console.log(`Total pages in PDF: ${pdfData.Pages.length}`);
    
    // Create PDF chunks
    console.log(`\nCreating chunks of 5 pages each in ${outputDir}...`);
    const chunkPaths = await createPDFChunks(pdfPath, outputDir);
    
    // Get full text for token counting
    const fullText = pdfData.Pages.map(extractTextFromPage).join('\n\n');
    const tokenCount = countTokens(fullText);
    
    // Output results
    console.log('\n--- Token Count Results ---');
    console.log(`Total characters: ${fullText.length}`);
    console.log(`Total tokens: ${tokenCount}`);
    console.log('\nEstimated token usage for different models:');
    console.log(`- Claude/GPT models: ~${tokenCount} tokens`);
    console.log(`- LLAMA models: ~${tokenCount} tokens (may vary slightly)`);
    
    // Cost estimation (approximate)
    const gptInputCostPer1K = 0.01; // $0.01 per 1K tokens for GPT-4 input
    const claudeInputCostPer1K = 0.008; // $0.008 per 1K tokens for Claude 3 Opus input
    
    console.log('\nEstimated cost (input only):');
    console.log(`- GPT-4: ~$${((tokenCount / 1000) * gptInputCostPer1K).toFixed(4)}`);
    console.log(`- Claude 3 Opus: ~$${((tokenCount / 1000) * claudeInputCostPer1K).toFixed(4)}`);
    
    console.log(`\nSuccessfully created ${chunkPaths.length} chunks in ${outputDir}`);
    
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

// Run the main function
main();