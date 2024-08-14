import { tblSteps } from "~/server/models";

export const createNewStep = async (data) => {
    const createReqData = {
        ...data,
    };
    const newCustomer = await tblSteps.create(createReqData);
    return newCustomer
}
