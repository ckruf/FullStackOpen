export const InputStateSetter = (setter) => (event) => setter(event.target.value);


// check if array of blog posts is sorted in descending order of likes
export const isSorted = (blogArray) => {
    for (let i = 0; i < blogArray.length - 1; i++) {
        if (blogArray[i].likes < blogArray[i + 1].likes) {
            return false;
        }
    } 
    return true;

};
