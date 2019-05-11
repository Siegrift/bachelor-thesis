import { getApi } from '../../api'

export const requiredField = (value: any) => (value ? undefined : 'Required')

export const groupNameUniqueValidation = async (values: any) => {
  const { name } = values

  const groups = await getApi().getGroups({ name, exact: true })
  if (groups.length !== 0) {
    return Promise.reject({
      name: groups.length !== 0 && `Group with name ${name} already exist!`,
    })
  }
}
