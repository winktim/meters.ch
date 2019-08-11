export default function({ store, redirect }) {
  console.log('running not auth')
  if (store.state.apiToken !== null) {
    redirect('/')
  }
}
