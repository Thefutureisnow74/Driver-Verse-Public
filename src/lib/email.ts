// Send email using Brevo
const sendEmail = async (data: { to: string, subject: string, text: string, html?: string }) => {
    console.log('📧 Sending email via Brevo to:', data.to)
    
    if (!process.env.BREVO_API_KEY) {
        console.error('❌ BREVO_API_KEY is not set')
        throw new Error('BREVO_API_KEY is not set')
    }

    if (!process.env.BREVO_SENDER_EMAIL) {
        console.error('❌ BREVO_SENDER_EMAIL is not set')
        throw new Error('BREVO_SENDER_EMAIL is not set')
    }

    const payload = {
        sender: {
            name: process.env.BREVO_SENDER_NAME || "Driver Gigs",
            email: process.env.BREVO_SENDER_EMAIL
        },
        to: [
            {
                email: data.to,
                name: data.to.split('@')[0] // Use email prefix as name fallback
            }
        ],
        subject: data.subject,
        textContent: data.text,
        ...(data.html && { htmlContent: data.html })
    }

    try {
        console.log('📤 Sending email payload:', JSON.stringify(payload, null, 2))
        
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify(payload)
        })

        const result = await response.json()
        
        if (!response.ok) {
            console.error('❌ Brevo API error:', result)
            throw new Error(`Brevo API error: ${result.message || 'Unknown error'}`)
        }

        console.log('✅ Email sent successfully via Brevo:', result)
        return result
    } catch (error) {
        console.error('❌ Failed to send email via Brevo:', error)
        throw error
    }
}

export default sendEmail;