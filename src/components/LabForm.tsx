import React, { useEffect } from 'react';
import { useLabAnalysis, LabFormData } from '../hooks/useLabAnalysis';

interface LabFormProps {
  onAnalysisComplete?: (result: any) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  mapRef?: React.RefObject<any>;
}

export default function LabForm({ onAnalysisComplete, userLocation, mapRef }: LabFormProps) {
  const {
    formData,
    analysisResult,
    isLoading,
    error,
    isSimulationMode,
    updateFormData,
    resetForm,
    runAnalysis,
    clearResults
  } = useLabAnalysis(userLocation);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runAnalysis();
  };

  const handleInputChange = (field: keyof LabFormData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateFormData(field, numValue);
    }
  };


  // Monitorar resultados da análise e mostrar máscara vermelha se probabilidade > 60%
  useEffect(() => {
    if (analysisResult && userLocation && mapRef?.current) {
      const probabilidade = analysisResult.probabilidade;
      const coordinates: [number, number] = [userLocation.longitude, userLocation.latitude];
      
      if (probabilidade > 0.6) {
        console.log('🚨 Probabilidade alta detectada:', (probabilidade * 100).toFixed(1) + '%');
        console.log('🚨 Mostrando máscara vermelha no mapa');
        mapRef.current.showFloodAlert(coordinates, 1000);
      } else {
        console.log('✅ Probabilidade baixa:', (probabilidade * 100).toFixed(1) + '%');
        console.log('✅ Removendo máscara vermelha do mapa');
        mapRef.current.hideFloodAlert();
      }
    }
  }, [analysisResult, userLocation, mapRef]);

  const formatCoordinate = (value: number) => {
    return value.toFixed(4);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'white',
          margin: '0 0 8px 0',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
        }}>
          🔬 Analysis Lab
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: '0',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
        }}>
          Simulate rainfall conditions and analyze flood risks
        </p>
      </div>

      {/* Simulation Mode Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        backgroundColor: 'rgba(13, 82, 255, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(13, 82, 255, 0.3)'
      }}>
        <span style={{
          color: '#0D52FF',
          fontSize: '16px'
        }}>
          🔬
        </span>
        <span style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
        }}>
          Simulation Mode Active
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Coordinates */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}>
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={formatCoordinate(formData.longitude)}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}
              placeholder="-48.2772"
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}>
              Latitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={formatCoordinate(formData.latitude)}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}
              placeholder="-18.9189"
            />
          </div>
        </div>

        {/* Rainfall */}
        <div>
          <label style={{
            display: 'block',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}>
            Rainfall (mm)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="200"
            value={formData.chuva_mm}
            onChange={(e) => handleInputChange('chuva_mm', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}
            placeholder="50.0"
          />
        </div>

        {/* Frequency */}
        <div>
          <label style={{
            display: 'block',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}>
            Frequency (minutes)
          </label>
          <input
            type="number"
            step="1"
            min="1"
            max="1440"
            value={formData.freq_min}
            onChange={(e) => handleInputChange('freq_min', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}
            placeholder="60"
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '8px'
        }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px 24px',
              backgroundColor: isLoading ? 'rgba(13, 82, 255, 0.5)' : '#0D52FF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}
          >
            {isLoading ? '⏳ Analyzing...' : '🔬 Analyze'}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: '14px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </form>


      {/* Results */}
      {analysisResult && (
        <div style={{
          backgroundColor: 'rgba(13, 82, 255, 0.1)',
          border: '1px solid rgba(13, 82, 255, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '16px'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}>
            📊 Analysis Results
            {analysisResult.probabilidade > 0.6 && (
              <span style={{
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                marginLeft: '8px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}>
                🚨 ALERT ACTIVE
              </span>
            )}
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '4px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}>
                Probability
              </div>
              <div style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}>
                {(analysisResult.probabilidade * 100).toFixed(1)}%
              </div>
            </div>
            
            <div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '4px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}>
                Base Risk
              </div>
              <div style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}>
                {(analysisResult.risco_base * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '8px',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}>
              Influence Radius
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}>
                {analysisResult.raio_influencia.raio_m}m
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}>
                {(analysisResult.raio_influencia.prob_media * 100).toFixed(1)}% avg prob.
              </span>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={clearResults}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: 'transparent',
                color: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}
            >
              ✕ Close Results
            </button>
            
            {analysisResult.probabilidade > 0.6 && (
              <button
                onClick={() => {
                  if (mapRef?.current) {
                    mapRef.current.hideFloodAlert();
                  }
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                }}
              >
                🚫 Remove Alert
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px'
        }}>
          <div style={{
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}>
            ❌ Error: {error}
          </div>
        </div>
      )}
    </div>
  );
}
