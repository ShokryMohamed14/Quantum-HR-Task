export interface UserName {
  title: string
  first: string
  last: string
}

export interface UserLocation {
  street: {
    number: number
    name: string
  }
  city: string
  state: string
  country: string
  postcode: string | number
}

export interface UserPicture {
  large: string
  medium: string
  thumbnail: string
}

export interface User {
  login: {
    uuid: string
  }
  name: UserName
  email: string
  phone: string
  cell: string
  location: UserLocation
  picture: UserPicture
  nat: string
}

export interface UsersApiResponse {
  results: User[]
  info: {
    seed: string
    results: number
    page: number
    version: string
  }
}
