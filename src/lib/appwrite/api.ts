import { ID } from 'appwrite';

import { INewUser } from "@/types";

export async function createUserAccount(user: INewUserwUser) {
  try {
    const newAccount = await account.create(
        ID.unique(),
    )
  } catch (error) {
    console.log(error);
    return error;
  }
}