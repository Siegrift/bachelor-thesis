export const printFormData = (formData: FormData) => {
  for (const pair of formData.entries() as any) {
    console.log(pair[0] + ', ' + pair[1])
  }
}
