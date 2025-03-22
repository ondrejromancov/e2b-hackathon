"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DeepPartial } from "react-hook-form"
import { InteractiveAppSchema } from "@/lib/schema"
import { ExecutionResult, ExecutionResultWeb } from "@/lib/types"
import { InteractiveAppView } from "./interactive-app-view"

const SAMPLE_APP: InteractiveAppSchema = {
  commentary:
    "I'll create an interactive visualization app for mathematical powers. This app will allow users to input a number and see how different power functions (quadratic, cubic, etc.) affect it. I'll use JavaScript with a React frontend and Chart.js for visualization. The app will feature a simple input field for the base number and display multiple curves representing different powers (x^1, x^2, x^3, x^4, x^5) on a responsive graph. Users will be able to see how the input value changes when raised to different powers, with visual highlights on the graph showing these points.",
  template: "nextjs-developer",
  title: "Power Visualizer",
  description:
    "Interactive tool to visualize how different powers affect numbers with real-time graphing.",
  additional_dependencies: ["chart.js", "react-chartjs-2"],
  has_additional_dependencies: true,
  install_dependencies_command: "npm install chart.js react-chartjs-2",
  port: 3000,
  code: [
    {
      file_name: "index.js",
      file_path: "pages/index.js",
      file_content: `import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [power, setPower] = useState(2);
  const [range, setRange] = useState('medium');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Calculate power values
  const calculatePowerFunction = (power, xValues) => xValues.map(x => Math.pow(x, power));

  // Generate an array of x values
  const generateXValues = (min, max, steps = 200) => {
    const step = (max - min) / steps;
    const xValues = [];
    for (let i = 0; i <= steps; i++) {
      xValues.push(min + i * step);
    }
    return xValues;
  };

  // Update chart with new data
  const updateChart = () => {
    if (!chartRef.current) return;
    let xMin, xMax;
    switch (range) {
      case 'small':
        xMin = -5;
        xMax = 5;
        break;
      case 'large':
        xMin = -20;
        xMax = 20;
        break;
      case 'medium':
      default:
        xMin = -10;
        xMax = 10;
    }
    
    const xValues = generateXValues(xMin, xMax);
    const yValues = calculatePowerFunction(power, xValues);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
          label: \`f(x) = x^\${power}\`,
          data: yValues.map((y, i) => ({ x: xValues[i], y })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: 'center',
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            title: { display: true, text: 'x' }
          },
          y: {
            type: 'linear',
            position: 'center',
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            title: { display: true, text: 'f(x)' }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return \`f(\${context.parsed.x.toFixed(2)}) = \${context.parsed.y.toFixed(2)}\`;
              }
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') updateChart();
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [power, range]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Power Function Visualizer</title>
        <meta name='description' content='Visualize power functions with Next.js' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Power Function Visualizer</h1>
        <p className={styles.description}>
          Explore how different power functions (y = x^n) behave by adjusting the power value.
        </p>
        <div className={styles.controls}>
          <div className={styles.controlItem}>
            <label htmlFor='power'>Power (n):</label>
            <input
              type='range'
              id='power'
              value={power}
              onChange={e => setPower(parseFloat(e.target.value))}
              step='0.1'
              min='0.1'
              max='10'
              className={styles.slider}
            />
            <span>{power.toFixed(1)}</span>
          </div>
          <div className={styles.controlItem}>
            <label htmlFor='range'>X Range:</label>
            <select
              id='range'
              value={range}
              onChange={e => setRange(e.target.value)}
              className={styles.select}
            >
              <option value='small'>-5 to 5</option>
              <option value='medium'>-10 to 10</option>
              <option value='large'>-20 to 20</option>
            </select>
          </div>
        </div>
        <div className={styles.formula}>
          Current function: f(x) = x¹<sup>{power}</sup>
        </div>
        <div className={styles.chartContainer}>
          <canvas ref={chartRef}></canvas>
        </div>
        <div className={styles.info}>
          <h3>About Power Functions</h3>
          <p>A power function has the form f(x) = x^n, where n is a constant.</p>
          <ul>
            <li>When n = 1: Linear function (straight line)</li>
            <li>When n = 2: Quadratic function (parabola)</li>
            <li>When n = 3: Cubic function</li>
            <li>When n = 0.5: Square root function</li>
            <li>When n is negative: Reciprocal power function</li>
          </ul>
          <p>Try different values to see how the shape changes!</p>
        </div>
      </main>
    </div>
  );
}`,
      file_finished: true,
    },
    {
      file_name: "Home.module.css",
      file_path: "styles/Home.module.css",
      file_content: `/* styles/Home.module.css */
.container {
  padding: 0 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.main {
  min-height: 100vh;
  padding: 4rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  margin: 0;
  line-height: 1.15;
  font-size: 2rem;
  text-align: center;
}

.description {
  margin: 1rem 0;
  line-height: 1.5;
  font-size: 1.1rem;
  text-align: center;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin: 1.5rem 0;
  width: 100%;
  justify-content: center;
}

.controlItem {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider {
  width: 200px;
}

.select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.formula {
  font-size: 18px;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
}

.chartContainer {
  position: relative;
  height: 400px;
  width: 100%;
  margin-bottom: 20px;
}

.info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
}`,
      file_finished: true,
    },
    {
      file_name: "globals.css",
      file_path: "styles/globals.css",
      file_content: `/* styles/globals.css */
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}`,
      file_finished: true,
    },
  ],
  code_finished: true,
}

export function InteractivePanel() {
  const [result, setResult] = useState<ExecutionResult>()
  const [interactiveApp, setInteractiveApp] = useState<DeepPartial<InteractiveAppSchema>>()

  function setCurrentPreview(preview: {
    interactiveApp: DeepPartial<InteractiveAppSchema> | undefined
    result: ExecutionResult | undefined
  }) {
    setInteractiveApp(preview.interactiveApp)
    setResult(preview.result)
  }

  const handleStartExercise = async () => {
    const response = await fetch("/api/sandbox", {
      method: "POST",
      body: JSON.stringify({
        fragment: SAMPLE_APP,
        userID: "sample-user-id",
      }),
    })

    const result = await response.json()
    console.log("result", result)

    setResult(result)
    setCurrentPreview({ interactiveApp, result })
  }

  if (result) {
    return <InteractiveAppView result={result as ExecutionResultWeb} />
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle>Interactive Learning</CardTitle>
        <CardDescription>Explore concepts with interactive exercises</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 pt-4">
        <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg h-full">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">Interactive Learning Space</h3>
            <p className="text-muted-foreground mb-4">
              This area will contain interactive elements related to your learning topic.
            </p>
            <Button variant="outline" onClick={handleStartExercise}>
              Start Interactive Exercise
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
