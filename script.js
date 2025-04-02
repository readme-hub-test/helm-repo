const ORG_NAME = "readme-hub-test"; // Set your GitHub organization name here

async function fetchReadmes() {
    const container = document.getElementById("readmeContainer");
    container.innerHTML = "<p>Loading...</p>";

    try {
        const reposResponse = await fetch(`https://api.github.com/orgs/${ORG_NAME}/repos`);
        const repos = await reposResponse.json();
        
        if (!Array.isArray(repos) || repos.length === 0) {
            container.innerHTML = "<p>No repositories found.</p>";
            return;
        }

        const readmePromises = repos.map(async (repo) => {
            try {
                const readmeResponse = await fetch(`https://api.github.com/repos/${ORG_NAME}/${repo.name}/readme`, {
                    headers: { Accept: "application/vnd.github.v3+json" }
                });
                const readmeData = await readmeResponse.json();

                if (!readmeData.download_url) throw new Error("No README found");

                const content = await (await fetch(readmeData.download_url)).text();

                return `
                    <div class="bg-white p-4 shadow rounded-lg">
                        <h2 class="text-xl font-semibold">${repo.name}</h2>
                        <div class="prose max-w-none">${marked(content)}</div>
                    </div>
                `;
            } catch (error) {
                return `<div class="bg-white p-4 shadow rounded-lg">
                    <h2 class="text-xl font-semibold">${repo.name}</h2>
                    <p class="text-red-500">No README found.</p>
                </div>`;
            }
        });

        const readmes = await Promise.all(readmePromises);
        container.innerHTML = readmes.join("");
    } catch (error) {
        container.innerHTML = "<p class='text-red-500'>Error fetching data.</p>";
        console.error(error);
    }
}

// Fetch the READMEs on page load
document.addEventListener("DOMContentLoaded", fetchReadmes);
