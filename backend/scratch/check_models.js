async function checkModels() {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        const data = await response.json();
        const bflModels = data.data.filter(m => m.id.toLowerCase().includes('black-forest'));
        console.log("BFL models found:", bflModels.length);
        console.log(bflModels.map(m => m.id));
        
        // Also look for anything containing 'schnell' or 'dev' or 'flux'
        const specificModels = data.data.filter(m => 
            m.id.toLowerCase().includes('flux') || 
            m.id.toLowerCase().includes('schnell') ||
            m.id.toLowerCase().includes('flux')
        );
        console.log("Specific image models found:", specificModels.map(m => m.id));
    } catch (error) {
        console.error(error);
    }
}

checkModels();
