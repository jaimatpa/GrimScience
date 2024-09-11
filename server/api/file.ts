import { defineEventHandler } from 'h3'
import { randomUUID } from 'node:crypto'
import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw new Error('No form data received')
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // Ensure the public/uploads directory exists
    await mkdir(uploadDir, { recursive: true })

    const fileTypes = ['Drawing/Manual', 'PDS', 'SDS']
    
    // Process each file type and upload files if present
    const uploadPromises = fileTypes.map(async (fileType) => {
      const file = formData.find(f => f.name === fileType)
      
      // Skip this fileType if no file is uploaded
      if (!file) {
        return null // No file, so nothing to process
      }

      // Validate the file type, allowing only PDFs
      if (file.type !== 'application/pdf') {
        throw new Error(`Invalid file type for ${fileType}: ${file.type}. Only PDFs are allowed.`)
      }

      // Create a unique file name and path
      const fileName = `${fileType.toLowerCase().replace('/', '_')}_${randomUUID()}.pdf`
      const filePath = join(uploadDir, fileName)

      // Write file to the designated path
      await writeFile(filePath, file.data)

      // Return file details
      return {
        fileType,
        originalName: file.filename,
        savedAs: fileName,
        size: file.data.length,
        url: `/uploads/${fileName}`,
        filePath // Return file path in the response object
      }
    })

    // Wait for all file uploads and filter out any null results (where no file was uploaded)
    const results = await Promise.all(uploadPromises)
    const validResults = results.filter(result => result !== null)

    return {
      message: 'Files uploaded successfully',
      files: validResults, // Only include valid file details in response
    }
  } catch (error) {
    console.error('Error processing upload:', error)
    event.node.res.statusCode = 500
    return {
      message: 'Error processing upload',
      error: error.message,
    }
  }
})

