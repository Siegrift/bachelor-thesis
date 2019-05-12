import { CreateUserRequest, getApi, GetUserGroupsRequest } from '../../api'
import { size } from 'lodash'

export const requiredField = (value: any) => (value ? undefined : 'Required')

export const groupNameUniqueValidation = async (values: any) => {
  const { name } = values
  const errors = {} as any

  const groups = await getApi().getGroups({ name, exact: true })
  if (groups.length !== 0) {
    errors.name = `Group with name ${name} already exist!`
  }

  if (size(errors) > 0) return Promise.reject(errors)
}

export const editUserValidation = async (values: any) => {
  const { name } = values
  const errors = {} as any

  const users = await getApi().getUsers({ name, exact: true })
  if (users.length > 0) {
    errors.name = `User with name ${name} already exist!`
  }

  if (size(errors) > 0) return Promise.reject(errors)
}

export const createUserValidation = async (values: CreateUserRequest) => {
  const { name, password, repeatPassword } = values
  const errors = {} as any

  const users = await getApi().getUsers({ name, exact: true })
  if (password !== repeatPassword) {
    errors.repeatPassword = `Repeated password differs from password!`
  }
  if (users.length > 0) {
    errors.name = `User with name ${name} already exist!`
  }

  if (size(errors) > 0) return Promise.reject(errors)
}

export const uniqueUserGroupValidation = async (
  values: GetUserGroupsRequest,
) => {
  const { userId, groupId } = values
  const errors = {} as any

  if (!userId || !groupId) return

  const userGroups = await getApi().getUserGroups({
    userId,
    groupId,
    conjunction: true,
  })
  if (userGroups.length > 0) {
    errors.userId = `User is already part of that group!`
  }

  if (size(errors) > 0) return Promise.reject(errors)
}

export const problemValidation = async (values: any) => {
  const { name, files } = values
  const errors = {} as any

  console.log(values)

  const problems = await getApi().getProblems({ name, exact: true })
  if (!name) errors.name = requiredField(name)
  else if (problems.length !== 0) {
    errors.name = `Problem with name ${name} already exist!`
  }

  if (files.length === 0) {
    errors.files = 'There must be at least one file in a problem!'
  }

  if (size(errors) > 0) return Promise.reject(errors)
}
