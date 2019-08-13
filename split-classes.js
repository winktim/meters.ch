const classes = process.argv[2]
const join = process.argv[3] !== undefined

if (!join) {
  console.log(JSON.stringify(classes.split(' ')))
} else {
  console.log(eval(classes).join(' '))
}
