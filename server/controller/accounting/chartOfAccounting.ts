import { QueryTypes } from 'sequelize';
import sequelize from '~/server/utils/databse';

// Get all accounts
export async function getAllAccounts() {
    try {
        const query = `
            SELECT * 
            FROM tblAccounts 
            ORDER BY AcctNumber
        `;

        const accounts = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return accounts;
    } catch (error) {
        console.error('Error in getAllAccounts:', error);
        throw error;
    }
}

// Get account by ID
export async function getAccountById(id) {
    try {
        const query = `
            SELECT * 
            FROM tblAccounts 
            WHERE UniqueID = :id
        `;

        const [account] = await sequelize.query(query, {
            replacements: { id },
            type: QueryTypes.SELECT
        });

        return account;
    } catch (error) {
        console.error('Error in getAccountById:', error);
        throw error;
    }
}

// Create new account with validation
export async function createAccount(accountData) {
    try {
        // Validation
        if (!accountData.AcctNumber || parseInt(accountData.AcctNumber) === 0) {
            throw new Error('You must enter a unique, valid number.');
        }

        if (!accountData.Description || accountData.Description.trim().length < 2) {
            throw new Error('You must enter a Description for the account.');
        }

        // Check for unique account number
        const existingAccount = await sequelize.query(
            'SELECT AcctNumber FROM tblAccounts WHERE AcctNumber = :AcctNumber',
            {
                replacements: { AcctNumber: accountData.AcctNumber },
                type: QueryTypes.SELECT
            }
        );

        if (existingAccount.length > 0) {
            throw new Error('You must enter a unique number.');
        }


        // Insert new account
        const insertQuery = `
            INSERT INTO tblAccounts (
                AcctNumber,
                Description
            ) VALUES (
                :AcctNumber,
                :Description
            )
        `;

        const [data] = await sequelize.query(insertQuery, {
            replacements: accountData,
            type: QueryTypes.INSERT
        });

        return data;
    } catch (error) {
        console.error('Error in createAccount:', error);
        throw error;
    }
}

// Update existing account
export async function updateAccount(accountData) {
    try {
        // Validation
        if (!accountData.AcctNumber || parseInt(accountData.AcctNumber) === 0) {
            throw new Error('You must enter a unique, valid number.');
        }


        // Check if account number is unique (excluding current record)
        const existingAccount = await sequelize.query(
            'SELECT AcctNumber FROM tblAccounts WHERE AcctNumber = :AcctNumber AND UniqueID != :id',
            {
                replacements: {
                    AcctNumber: accountData.AcctNumber,
                    id: accountData.UniqueID
                },
                type: QueryTypes.SELECT
            }
        );

        if (existingAccount.length > 0) {
            throw new Error('You must enter a unique number.');
        }

        // Update account
        const updateQuery = `
            UPDATE tblAccounts 
            SET 
                AcctNumber = :AcctNumber,
                Description = :Description
            WHERE UniqueID = :UniqueID
        `;

        await sequelize.query(updateQuery, {
            replacements: accountData,
            type: QueryTypes.UPDATE
        });

        return true;
    } catch (error) {
        console.error('Error in updateAccount:', error);
        throw error;
    }
}


// Check if account is in use (for payable system)
export async function checkAccountInPayables(accountId) {
    try {
        const query = `
            SELECT COUNT(*) as count 
            FROM tblPayables
            WHERE accountId = :accountId
        `;

        const [result] = await sequelize.query(query, {
            replacements: { accountId },
            type: QueryTypes.SELECT
        });

        return result.count > 0;
    } catch (error) {
        console.error('Error in checkAccountInPayables:', error);
        throw error;
    }
}

// Get account details for payable system
export async function getAccountDetailsForPayable(accountId) {
    try {
        const query = `
            SELECT a.*, 
                   ISNULL((
                       SELECT SUM(amount) 
                       FROM tblPayable 
                       WHERE accountId = a.UniqueID 
                       AND status = 'Open'
                   ), 0) as openBalance
            FROM tblAccounts a
            WHERE a.UniqueID = :accountId
        `;

        const [account] = await sequelize.query(query, {
            replacements: { accountId },
            type: QueryTypes.SELECT
        });

        return account;
    } catch (error) {
        console.error('Error in getAccountDetailsForPayable:', error);
        throw error;
    }
}
