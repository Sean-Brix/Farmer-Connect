// Utility function to truncate text
export const truncate = (str, n = 24) =>
    str && str.length > n ? str.slice(0, n) + '...' : str;

// Convert category to snake case with title case words
export const convertToSnakeCase = (category) => {
    return category
        .split(' ')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('_');
};

// Group stacks by status
export const groupStacksByStatus = (stacks) => {
    return stacks.reduce((acc, stack) => {
        if (!acc[stack.status]) {
            acc[stack.status] = {
                stacks: [],
                totalQuantity: 0,
            };
        }
        acc[stack.status].stacks.push(stack);
        acc[stack.status].totalQuantity += stack.quantity;
        return acc;
    }, {});
};
