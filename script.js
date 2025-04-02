const readmeResponse = await fetch(`https://api.github.com/repos/${ORG_NAME}/${repo.name}/readme`, {
    headers: { Accept: "application/vnd.github.v3+json" }
});

// Log the response to see what's returned
const readmeData = await readmeResponse.json();
console.log(readmeData);

if (readmeData.message && readmeData.message === 'Not Found') {
    console.log(`No README found for ${repo.name}`);
    return `<div class="bg-white p-4 shadow rounded-lg">
        <h2 class="text-xl font-semibold">${repo.name}</h2>
        <p class="text-red-500">No README found.</p>
    </div>`;
}

const content = await (await fetch(readmeData.download_url)).text();

// Now process the content if the README was found
return `
    <div class="bg-white p-4 shadow rounded-lg">
        <h2 class="text-xl font-semibold">${repo.name}</h2>
        <div class="prose max-w-none">${marked(content)}</div>
    </div>
`;
