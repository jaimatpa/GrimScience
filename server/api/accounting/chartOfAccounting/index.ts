import { createAccount, getAccountById, getAccountDetailsForPayable, getAllAccounts, updateAccount } from "~/server/controller/accounting/chartOfAccounting";

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        switch (method.toUpperCase()) {
            case "GET":
                const { id, includePayables } = getQuery(event);

                // If ID is provided, get specific account
                if (id) {
                    if (includePayables) {
                        const accountDetails = await getAccountDetailsForPayable(id);
                        return {
                            body: accountDetails,
                            message: "Account details retrieved successfully!"
                        };
                    }
                    const account = await getAccountById(id);
                    return {
                        body: account,
                        message: "Account retrieved successfully!"
                    };
                }

                // Get all accounts
                const accounts = await getAllAccounts();
                return {
                    body: accounts,
                    message: "Accounts retrieved successfully!"
                };

            case "POST":
                const createData = await readBody(event);
                
                const newAccountId = await createAccount(createData);
                return {
                    body: { id: newAccountId },
                    message: "Account created successfully!"
                };

            case "PUT":
                const updateData = await readBody(event);
                await updateAccount(updateData);
                return {
                    body: { success: true },
                    message: "Account updated successfully!"
                };

            default:
                throw createError({
                    statusCode: 405,
                    message: "Method Not Allowed"
                });
        }
    } catch (error) {
        // Handle specific validation errors
        if (error.message.includes("unique") ||
            error.message.includes("valid number") ||
            error.message.includes("description")) {
            throw createError({
                statusCode: 400,
                message: error.message
            });
        }

        // Handle other errors
        throw createError({
            statusCode: 500,
            message: `Error processing account request: ${error.message}`
        });
    }
});