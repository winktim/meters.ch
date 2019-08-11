export default function({ store, redirect }) {
  console.log('running needs auth')
  if (store.state.apiToken === null) {
    redirect('/login')
  }
}
