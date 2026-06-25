import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const json = (data, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

export async function OPTIONS() {
  return json({})
}

export async function GET(request, { params }) {
  const path = (await params)?.path || []
  const route = path.join('/')

  if (route === '' || route === 'health') {
    return json({ status: 'ok', service: 'salman-portfolio' })
  }

  if (route === 'github/contributions') {
    try {
      console.log("Token loaded:", !!process.env.GITHUB_TOKEN)

      const now = new Date()
      const from = new Date(now)
      from.setDate(from.getDate() - 367)

      const query = `
        query {
          user(login: "salmandev07") {
            contributionsCollection(
              from: "${from.toISOString()}"
              to: "${now.toISOString()}"
            ) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    contributionLevel
                    date
                  }
                }
              }
            }
          }
        }
      `

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 3600 },
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GitHub API Error')
      }

      const calendar =
        result?.data?.user?.contributionsCollection?.contributionCalendar

      if (!calendar) {
        throw new Error('Contribution calendar not found')
      }

      return json({
        username: 'salmandev07',
        total: calendar.totalContributions,
        weeks: calendar.weeks,
      })
    } catch (e) {
      return json(
        {
          username: 'salmandev07',
          total: 0,
          weeks: [],
          error: String(e?.message || e),
        },
        500
      )
    }
  }

  return json({ error: 'Not found' }, 404)
}

export async function POST(request, { params }) {
  const path = (await params)?.path || []
  const route = path.join('/')

  try {
    if (route === 'contact') {
      const body = await request.json()
      const { name, email, message } = body || {}
      if (!name || !email || !message) {
        return json({ error: 'Missing required fields' }, 400)
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'salmandevxofficial@gmail.com',
        replyTo: email,
        subject: `Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#111;border-radius:12px;color:#fff;">
            <h2 style="color:#10b981;">New Portfolio Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr style="border-color:#333;">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        `,
      })

      return json({ success: true })
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    return json({ error: 'Server error', detail: String(e?.message || e) }, 500)
  }
}
