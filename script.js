document.getElementById('nextStep').addEventListener('click', () => {
    const tolerance = parseFloat(document.getElementById('tolerance').value);

    if (isNaN(tolerance) || tolerance <= 0) {
        alert("Por favor, insira um erro válido (número positivo).");
        return;
    }

    const dynamicArea = document.getElementById('dynamicArea');
    dynamicArea.innerHTML = '';

    // Instruções para o usuário
    const instruction = document.createElement('p');
    instruction.innerText = "Insira os coeficientes das equações abaixo:";
    dynamicArea.appendChild(instruction);

    // Criação dinâmica da matriz e vetor
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-container';

    const size = 3; // Tamanho fixo (3x3) por simplicidade
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < size + 1; j++) { // 3 colunas + 1 para o vetor b
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = j === size ? `b${i + 1}` : `a${i + 1}${j + 1}`;
            input.className = 'matrix-input';
            row.appendChild(input);
        }
        matrixContainer.appendChild(row);
    }
    dynamicArea.appendChild(matrixContainer);

    // Botão de calcular
    const calculateButton = document.createElement('button');
    calculateButton.innerText = "Calcular";
    calculateButton.addEventListener('click', () => calculateGaussSeidel(tolerance));
    dynamicArea.appendChild(calculateButton);
});

function calculateGaussSeidel(tolerance) {
    // Pegando os inputs do HTML
    const inputs = document.querySelectorAll('.matrix-input');
    const size = 3; // Tamanho fixo
    const matrix = [];
    const b = [];
    const initialGuess = [0, 0, 0];

    for (let i = 0; i < size; i++) {
        matrix.push([]);
        for (let j = 0; j < size; j++) {
            matrix[i].push(parseFloat(inputs[i * (size + 1) + j].value) || 0);
        }
        b.push(parseFloat(inputs[i * (size + 1) + size].value) || 0);
    }

    // Executando o método de Gauss-Seidel
    const maxIterations = 5;
    const solution = [...initialGuess];
    let converged = false;

    for (let iter = 0; iter < maxIterations; iter++) {
        const prevSolution = [...solution];
        for (let i = 0; i < size; i++) {
            let sum = b[i];
            for (let j = 0; j < size; j++) {
                if (i !== j) {
                    sum -= matrix[i][j] * solution[j];
                }
            }
            solution[i] = sum / matrix[i][i];
        }

        // Error computation
        const error = Math.max(...solution.map((val, idx) => Math.abs(val - prevSolution[idx])));
        if (error <= tolerance) {
            converged = true;
            break;
        }
    }

    // Exibindo resultados
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result';

    resultDiv.innerText = `Raízes aproximadas: ${solution.map((x, i) => `x${i + 1} = ${x.toFixed(3)}`).join(', ')}`;

    document.getElementById('dynamicArea').appendChild(resultDiv);
}
