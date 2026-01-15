import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const token = searchParams.get('token')
    const userParam = searchParams.get('user')
    const error = searchParams.get('error')

    console.log('AuthCallback - token:', token ? 'exists' : 'missing')
    console.log('AuthCallback - user:', userParam ? 'exists' : 'missing')
    console.log('AuthCallback - error:', error)

    if (error) {
      setStatus('Error: ' + error)
      setTimeout(() => navigate('/login', { state: { error } }), 2000)
      return
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam))
        console.log('AuthCallback - parsed user:', user)
        
        // Store token and user in localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        setStatus('Success! Redirecting...')
        // Redirect to home page after a short delay
        setTimeout(() => navigate('/home'), 500)
      } catch (err) {
        console.error('Failed to parse user data:', err)
        setStatus('Error parsing user data')
        setTimeout(() => navigate('/login'), 2000)
      }
    } else {
      setStatus('Missing token or user data')
      setTimeout(() => navigate('/login'), 2000)
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B7C59] mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}