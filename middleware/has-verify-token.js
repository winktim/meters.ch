export default function ({ query, redirect }) {
  if (!query.verify_token) {
    redirect('/login')
  }
}
