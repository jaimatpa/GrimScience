import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
    try {
        const { html } = await readBody(event)

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: 'true'
        })
        const page = await browser.newPage()

        // Set content
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        })

        // Generate PDF
        const pdf = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0.4in',
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in'
            }
        })

        // Close browser
        await browser.close()

        // Set response headers
        setHeader(event, 'Content-Type', 'application/pdf')
        setHeader(event, 'Content-Disposition', 'inline; filename=shipping-labels.pdf')

        return pdf
    } catch (error) {
        console.error('PDF generation error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to generate PDF'
        })
    }
})