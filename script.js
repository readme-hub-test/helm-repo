async function fetchReadmes() {
    const ORG_NAME = 'readme-hub-test'; // Use your actual organization name
    const reposResponse = await fetch(`https://api.github.com/orgs/${ORG_NAME}/repos`);
    const repos = await reposResponse.json();

    const readmes = await Promise.all(repos.map(async (repo) => {
        const readmeResponse = await fetch(`https://api.github.com/repos/${ORG_NAME}/${repo.name}/contents/README.md?ref=main`);
        const readmeData = await readmeResponse.json();
        const readmeContent = await fetch(readmeData.download_url);
        const readmeText = await readmeContent.text();
        return {
            name: repo.name,
            readmeHtml: marked(readmeText) // Parse the README text to HTML using marked
        };
    }));

    const readmeContainer = document.getElementById('readmeContainer');
    readmes.forEach(({ name, readmeHtml }) => {
        const repoDiv = document.createElement('div');
        repoDiv.innerHTML = `<h2>${name}</h2>${readmeHtml}`;
        readmeContainer.appendChild(repoDiv);
    });
}
