const ExportModule = (function() {
    function generateRecipeCard(recipe) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const cardWidth = 600;
        const cardHeight = 800;
        const margin = 40;
        const padding = 30;
        
        canvas.width = cardWidth;
        canvas.height = cardHeight;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, cardWidth, cardHeight);
        
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, cardWidth - 20, cardHeight - 20);
        
        ctx.fillStyle = '#2C3E50';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(recipe.title || 'Recipe', cardWidth / 2, margin + 40);
        
        if (recipe.author) {
            ctx.fillStyle = '#95A5A6';
            ctx.font = 'italic 16px Inter, sans-serif';
            ctx.fillText(`By ${recipe.author}`, cardWidth / 2, margin + 70);
        }
        
        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin + 50, margin + 90);
        ctx.lineTo(cardWidth - margin - 50, margin + 90);
        ctx.stroke();
        
        let yPos = margin + 130;
        
        ctx.fillStyle = '#FF6B6B';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Ingredients', margin, yPos);
        
        yPos += 10;
        ctx.fillStyle = '#2C3E50';
        ctx.font = '14px Inter, sans-serif';
        
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach((ing) => {
                yPos += 22;
                ctx.fillText(`• ${ing}`, margin + 15, yPos);
            });
        }
        
        yPos += 30;
        
        ctx.fillStyle = '#FF6B6B';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText('Instructions', margin, yPos);
        
        yPos += 10;
        ctx.fillStyle = '#2C3E50';
        ctx.font = '14px Inter, sans-serif';
        
        if (recipe.instructions && recipe.instructions.length > 0) {
            recipe.instructions.forEach((inst, idx) => {
                yPos += 26;
                
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(margin + 10, yPos - 5, 10, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.fillStyle = '#FF6B6B';
                ctx.beginPath();
                ctx.arc(margin + 10, yPos - 5, 10, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${idx + 1}`, margin + 10, yPos - 1);
                ctx.textAlign = 'left';
                
                ctx.fillStyle = '#2C3E50';
                ctx.font = '14px Inter, sans-serif';
                
                const maxWidth = cardWidth - margin * 2 - 35;
                const words = inst.split(' ');
                let line = '';
                let lineY = yPos;
                
                words.forEach((word) => {
                    const testLine = line + word + ' ';
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > maxWidth) {
                        ctx.fillText(line, margin + 30, lineY);
                        line = word + ' ';
                        lineY += 20;
                    } else {
                        line = testLine;
                    }
                });
                ctx.fillText(line, margin + 30, lineY);
                yPos = lineY;
            });
        }
        
        if (recipe.prepTime || recipe.servings) {
            yPos += 30;
            ctx.fillStyle = '#95A5A6';
            ctx.font = '14px Inter, sans-serif';
            
            const metaParts = [];
            if (recipe.prepTime) metaParts.push(`Prep: ${recipe.prepTime} min`);
            if (recipe.servings) metaParts.push(`Servings: ${recipe.servings}`);
            ctx.fillText(metaParts.join('  •  '), margin, yPos);
        }
        
        if (recipe.tags && recipe.tags.length > 0) {
            yPos += 30;
            ctx.fillStyle = '#4ECDC4';
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText(recipe.tags.map(t => `#${t}`).join('  '), margin, yPos);
        }
        
        ctx.fillStyle = '#E8E8E8';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Created with Kitchen Heritage', cardWidth / 2, cardHeight - 25);
        
        return canvas;
    }
    
    function downloadImage(recipe) {
        const canvas = generateRecipeCard(recipe);
        const link = document.createElement('a');
        const filename = (recipe.title || 'recipe').toLowerCase().replace(/\s+/g, '-');
        
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    function printRecipe(recipe) {
        const printWindow = window.open('', '_blank');
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${recipe.title} - Kitchen Heritage</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            max-width: 700px;
            margin: 2rem auto;
            padding: 0 1rem;
            color: #2C3E50;
            line-height: 1.8;
        }
        h1 {
            color: #FF6B6B;
            border-bottom: 3px solid #4ECDC4;
            padding-bottom: 0.5rem;
            margin-bottom: 0.25rem;
        }
        .author {
            color: #95A5A6;
            font-style: italic;
            margin-bottom: 1.5rem;
        }
        .photo {
            max-width: 100%;
            max-height: 400px;
            border-radius: 12px;
            margin: 1.5rem 0;
        }
        .meta {
            color: #95A5A6;
            margin-bottom: 1.5rem;
        }
        h2 {
            color: #FF6B6B;
            margin-top: 2rem;
        }
        .ingredients li {
            margin: 0.5rem 0;
            padding-left: 0.5rem;
            border-left: 3px solid #4ECDC4;
        }
        .instructions {
            counter-reset: step;
            list-style: none;
            padding-left: 0;
        }
        .instructions li {
            counter-increment: step;
            margin: 1rem 0;
            padding-left: 2.5rem;
            position: relative;
        }
        .instructions li::before {
            content: counter(step);
            position: absolute;
            left: 0;
            top: 0;
            width: 24px;
            height: 24px;
            background: #FF6B6B;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.875rem;
        }
        .story {
            background: #F7F7F7;
            padding: 1.5rem;
            border-radius: 12px;
            border-left: 4px solid #4ECDC4;
            font-style: italic;
            margin-top: 2rem;
        }
        .tags {
            color: #95A5A6;
            margin-top: 1.5rem;
        }
        .footer {
            text-align: center;
            color: #CCC;
            font-size: 0.75rem;
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 1px solid #E8E8E8;
        }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    ${recipe.photo ? `<img src="${recipe.photo}" alt="${recipe.title}" class="photo">` : ''}
    <h1>${recipe.title}</h1>
    ${recipe.author ? `<p class="author">By ${recipe.author}</p>` : ''}
    
    <div class="meta">
        ${recipe.prepTime ? `Prep Time: ${recipe.prepTime} minutes` : ''}
        ${recipe.prepTime && recipe.servings ? '  •  ' : ''}
        ${recipe.servings ? `Servings: ${recipe.servings}` : ''}
    </div>
    
    <h2>Ingredients</h2>
    <ul class="ingredients">
        ${(recipe.ingredients || []).map(ing => `<li>${ing}</li>`).join('')}
    </ul>
    
    <h2>Instructions</h2>
    <ol class="instructions">
        ${(recipe.instructions || []).map(inst => `<li>${inst}</li>`).join('')}
    </ol>
    
    ${recipe.story ? `
        <div class="story">
            <h2>Family Story</h2>
            <p>${recipe.story}</p>
        </div>
    ` : ''}
    
    ${recipe.tags && recipe.tags.length > 0 ? `
        <div class="tags">
            Tags: ${recipe.tags.map(t => `#${t}`).join('  ')}
        </div>
    ` : ''}
    
    <div class="footer">
        Created with Kitchen Heritage • ${new Date().toLocaleDateString()}
    </div>
    
    <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
        
        printWindow.document.write(html);
        printWindow.document.close();
    }
    
    function generateShareURL(recipe) {
        const minimalRecipe = {
            t: recipe.title,
            i: recipe.ingredients,
            n: recipe.instructions,
            p: recipe.prepTime,
            s: recipe.servings,
            a: recipe.author,
            st: recipe.story,
            tg: recipe.tags
        };
        
        const encoded = btoa(JSON.stringify(minimalRecipe));
        const shareURL = `${window.location.origin}${window.location.pathname}?recipe=${encoded}`;
        
        return shareURL;
    }
    
    function parseShareURL() {
        const params = new URLSearchParams(window.location.search);
        const recipeData = params.get('recipe');
        
        if (recipeData) {
            try {
                const decoded = JSON.parse(atob(recipeData));
                return {
                    title: decoded.t,
                    ingredients: decoded.i,
                    instructions: decoded.n,
                    prepTime: decoded.p,
                    servings: decoded.s,
                    author: decoded.a,
                    story: decoded.st,
                    tags: decoded.tg
                };
            } catch (e) {
                console.error('Failed to parse shared recipe:', e);
                return null;
            }
        }
        
        return null;
    }
    
    return {
        generateRecipeCard,
        downloadImage,
        printRecipe,
        generateShareURL,
        parseShareURL
    };
})();

window.ExportModule = ExportModule;
