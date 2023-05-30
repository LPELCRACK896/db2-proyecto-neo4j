import React, { useEffect, useRef } from 'react';
import { DataSet } from 'vis';

function Diseño() {
  const graphRef = useRef(null);

  useEffect(() => {
    // Aquí es donde deberías obtener los datos del grafo desde AURA DB
    // y luego utilizar la referencia del gráfico para renderizarlo.

    // Ejemplo de código para obtener datos ficticios del grafo:
    const nodes = [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
    ];
    const edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ];
    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };

    const options = {
      // Opciones de configuración del grafo
    };

    if (graphRef.current) {
      const network = new window.vis.Network(graphRef.current, data, options);
    }
  }, []);

  return (
    <div>
      <h1>Graph Component</h1>
      <div ref={graphRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />
    </div>
  );
}

export default Diseño;
