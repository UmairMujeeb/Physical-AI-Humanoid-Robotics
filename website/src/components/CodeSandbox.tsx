import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

type CodeSandboxProps = {
  children: string;
  language?: string;
  title?: string;
  description?: string;
  allowExecution?: boolean;
  defaultCode?: string;
};

const CodeSandbox: React.FC<CodeSandboxProps> = ({
  children,
  language = 'python',
  title = 'Code Sandbox',
  description = 'An interactive code sandbox for experimenting with code examples',
  allowExecution = true,
  defaultCode
}) => {
  const [code, setCode] = useState(defaultCode || children.trim());
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [showConsole, setShowConsole] = useState(false);

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
    if (!allowExecution) return;
    if (!pyodide) {
      setOutput('Python interpreter not loaded yet. Please wait.');
      return;
    }

    setIsExecuting(true);
    setOutput('');

    try {
      // Execute the code
      const result = pyodide.runPython(code);

      // If there's a result, convert it to string
      let outputText = '';
      if (result !== undefined) {
        outputText = result.toString();
      }

      // Get stdout/stderr from Pyodide
      const capturedOutput = pyodide.runPython(`
        import sys
        from io import StringIO

        # Get stdout
        sys.stdout.getvalue() if hasattr(sys.stdout, 'getvalue') else ''
      `);

      setOutput(outputText || capturedOutput || 'Code executed successfully (no output)');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const resetCode = () => {
    setCode(defaultCode || children.trim());
    setOutput('');
  };

  const clearOutput = () => {
    setOutput('');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className="code-sandbox" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '0.75rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h4>
          {description && <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#666' }}>{description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {allowExecution && (
            <>
              <button
                onClick={runCode}
                disabled={isExecuting || isLoading || !pyodide}
                className="button button--primary button--sm"
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '4px'
                }}
              >
                {isExecuting ? 'Running...' : '▶ Run'}
              </button>
              <button
                onClick={clearOutput}
                disabled={isExecuting}
                className="button button--secondary button--sm"
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '4px'
                }}
              >
                Clear
              </button>
            </>
          )}
          <button
            onClick={resetCode}
            className="button button--secondary button--sm"
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.85rem',
              borderRadius: '4px'
            }}
          >
            Reset
          </button>
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="button button--secondary button--sm"
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.85rem',
              borderRadius: '4px'
            }}
          >
            {showConsole ? 'Hide Console' : 'Show Console'}
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <textarea
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
          style={{
            width: '100%',
            fontFamily: 'Monaco, Consolas, "Ubuntu Mono", monospace',
            fontSize: '14px',
            padding: '1rem',
            border: 'none',
            minHeight: '200px',
            resize: 'vertical',
            backgroundColor: '#fafafa',
            lineHeight: '1.5'
          }}
        />

        {showConsole && (
          <div style={{
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            fontFamily: 'Monaco, Consolas, "Ubuntu Mono", monospace',
            fontSize: '14px',
            minHeight: '100px',
            maxHeight: '200px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong>Console Output:</strong>
              {isLoading && <span style={{ color: '#9cdcfe' }}>Loading Python interpreter...</span>}
              {isExecuting && <span style={{ color: '#9cdcfe' }}>Executing code...</span>}
            </div>
            {output || <span style={{ color: '#808080', fontStyle: 'italic' }}>(No output yet)</span>}
          </div>
        )}
      </div>

      {isLoading && (
        <div style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: '#f0f8ff',
          color: '#0066cc',
          fontStyle: 'italic'
        }}>
          Loading Python interpreter... This may take a moment.
        </div>
      )}
    </div>
  );
};

// Wrapper component that only renders in browser
const CodeSandboxWrapper: React.FC<CodeSandboxProps> = (props) => {
  return (
    <BrowserOnly>
      {() => <CodeSandbox {...props} />}
    </BrowserOnly>
  );
};

export default CodeSandboxWrapper;