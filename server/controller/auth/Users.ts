import { tblEmployee } from "~/server/models";

export const getUserInfo = async (UniqueID: number | string) => {
  try {
    const userInfo = await tblEmployee.findOne({
      where: { UniqueID: UniqueID },
      attributes: { exclude: ['SECURITYCODE'] },
    });

    if (userInfo) {
      return userInfo;
    } else {
      return null;
    }
  } catch(err) {
    return err.message;
  }
};