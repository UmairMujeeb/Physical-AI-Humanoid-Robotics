import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

type InteractiveCodeBlockProps = {
  children: string;
  language?: string;
  title?: string;
};

const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({
  children,
  language = 'python',
  title = 'Interactive Code'
}) => {
  const [code, setCode] = useState(children.trim());
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);

  // Initialize Pyodide when component mounts in browser
  useEffect(() => {
    const loadPyodide = async () => {
      setIsLoading(true);
      try {
        // Dynamically load Pyodide using global approach to avoid build issues
        if (!(window as any).loadPyodide) {
          // Load the Pyodide script dynamically
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Pyodide'));
            document.head.appendChild(script);
          });
        }

        // @ts-ignore - pyodide is loaded globally
        const pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });

        // Install common packages used in robotics
        await pyodide.loadPackage(['numpy', 'scipy', 'matplotlib']);

        setPyodide(pyodide);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        setOutput('Error: Failed to load Python interpreter');
      } finally {
        setIsLoading(false);
      }
    };

    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide) {
      setOutput('Python interpreter not loaded yet. Please wait.');
      return;
    }

    setIsLoading(true);
    setOutput('');

    try {
      // Capture stdout and stderr
      const outputBuffer: string[] = [];

      // Set up output capture
      pyodide.runPython(`
        import sys
        from io import StringIO
        from contextlib import redirect_stdout, redirect_stderr

        # Create string buffers to capture output
        stdout_capture = StringIO()
        stderr_capture = StringIO()
      `);

      // Execute the code with captured output
      const result = pyodide.runPython(`
        try:
          with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            # Execute the user code
            exec("""${code}""")
          # Get captured output
          stdout_output = stdout_capture.getvalue()
          stderr_output = stderr_capture.getvalue()

          # Return both result and output
          {
            'result': None,  # We'll handle this differently
            'stdout': stdout_output,
            'stderr': stderr_output
          }
        except Exception as e:
          {
            'result': None,
            'stdout': stdout_capture.getvalue(),
            'stderr': stderr_capture.getvalue() + f"\\nError: {str(e)}"
          }
      `);

      // Get the captured output
      const capturedOutput = pyodide.globals.get('stdout_output') + pyodide.globals.get('stderr_output');

      setOutput(capturedOutput || 'Code executed successfully (no output)');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setCode(children.trim());
    setOutput('');
  };

  return (
    <div className="interactive-code-block">
      <div className="code-header">
        <h4>{title}</h4>
        <div className="code-actions">
          <button
            onClick={runCode}
            disabled={isLoading || !pyodide}
            className="button button--primary button--sm"
          >
            {isLoading ? 'Running...' : 'Run Code'}
          </button>
          <button
            onClick={resetCode}
            className="button button--secondary button--sm"
            style={{ marginLeft: '0.5rem' }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="code-container">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={Math.max(5, code.split('\n').length)}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'vertical'
          }}
        />
      </div>

      {output && (
        <div className="output-container" style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #dee2e6',
          fontFamily: 'monospace',
          fontSize: '14px',
          maxHeight: '200px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          <h5>Output:</h5>
          <pre style={{ margin: 0, overflowX: 'auto' }}>{output}</pre>
        </div>
      )}

      {isLoading && (
        <div className="loading" style={{ marginTop: '1rem', fontStyle: 'italic' }}>
          Executing code...
        </div>
      )}

      {!pyodide && !isLoading && (
        <div className="loading" style={{ marginTop: '1rem', fontStyle: 'italic', color: '#6c757d' }}>
          Loading Python interpreter...
        </div>
      )}
    </div>
  );
};

// Wrapper component that only renders in browser
const InteractiveCodeBlockWrapper: React.FC<InteractiveCodeBlockProps> = (props) => {
  return (
    <BrowserOnly>
      {() => <InteractiveCodeBlock {...props} />}
    </BrowserOnly>
  );
};

export default InteractiveCodeBlockWrapper;