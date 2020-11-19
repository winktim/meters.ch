export default function ({ store, redirect }) {
  if (store.state.apiToken === null) {
    redirect('/login')
  }
}
