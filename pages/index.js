import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update } from 'firebase/database';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBeceD8HjFKkrcCEdEFgnVDr1bMxdHlZbk",
  authDomain: "segundo-cerebro-38352.firebaseapp.com",
  projectId: "segundo-cerebro-38352",
  storageBucket: "segundo-cerebro-38352.firebasestorage.app",
  messagingSenderId: "346454504143",
  appId: "1:346454504143:web:59cec71eb529511d35bdba",
  databaseURL: "https://segundo-cerebro-38352.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const COLORS = {
  rosa: '#FFB3C6', pêssego: '#FFCBA4', amarelo: '#FFF07C',
  menta: '#B5EAD7', lavanda: '#C3B1E1', azul: '#AED9E0',
  lilás: '#E8C5F5', salmão: '#FFADA0',
};

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function uid() { return Math.random().toString(36).slice(2, 9); }

function CardBase({ color, icon, title, children, minH = 280 }) {
  return (
    <div style={{
      background: color, borderRadius: 24, padding: '20px 24px',
      minHeight: minH, boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'transform .2s, box-shadow .2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    }}>
      <div style={{
        fontFamily: "'Fredoka One', cursive", fontSize: 18, color: '#333',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 24 }}>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

function Btn({ onClick, children, color = '#fff', text = '#444', small, style: s = {} }) {
  return (
    <button onClick={onClick} style={{
      background: color, border: 'none', borderRadius: 12,
      padding: small ? '5px 12px' : '8px 16px', fontSize: small ? 12 : 13,
      fontWeight: 700, color: text, cursor: 'pointer',
      fontFamily: "'Nunito', sans-serif", boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all .15s', ...s,
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, type = 'text', style: s = {} }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: 'none', borderBottom: '2px solid rgba(0,0,0,0.2)',
        background: 'transparent', outline: 'none', fontSize: 13,
        padding: '6px 2px', color: '#333', fontFamily: "'Nunito', sans-serif",
        width: '100%', ...s,
      }} />
  );
}

function CalendarioInteligente({ eventos, setEventos }) {
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [view, setView] = useState('mes');
  const [diaSelected, setDiaSelected] = useState(new Date().getDate());
  const [novoEvento, setNovoEvento] = useState('');
  const [corEvento, setCorEvento] = useState(COLORS.rosa);
  const [horaEvento, setHoraEvento] = useState('09:00');

  const diasMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDia = new Date(ano, mes, 1).getDay();

  function addEvento() {
    if (!novoEvento.trim()) return;
    const chave = `${ano}-${mes}-${diaSelected}`;
    const novosDados = {
      ...eventos,
      [chave]: [...(eventos[chave] || []), {
        id: uid(), texto: novoEvento, cor: corEvento,
        hora: horaEvento, feito: false,
      }],
    };
    setEventos(novosDados);
    set(ref(database, 'eventos'), novosDados);
    setNovoEvento('');
  }

  function toggleEvento(chave, id) {
    const atualizado = {
      ...eventos,
      [chave]: eventos[chave].map(x => x.id === id ? { ...x, feito: !x.feito } : x),
    };
    setEventos(atualizado);
    set(ref(database, 'eventos'), atualizado);
  }

  function removeEvento(chave, id) {
    const atualizado = {
      ...eventos,
      [chave]: eventos[chave].filter(x => x.id !== id),
    };
    setEventos(atualizado);
    set(ref(database, 'eventos'), atualizado);
  }

  if (view === 'mes') {
    return (
      <CardBase color={COLORS.lavanda} icon="📅" title="Calendário">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button onClick={() => setMes(m => m === 0 ? 11 : m - 1)} style={{
            background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8,
            padding: '6px 12px', cursor: 'pointer', fontFamily: "'Nunito',sans-serif", fontSize: 12,
          }}>← Anterior</button>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: '#333' }}>
            {MESES[mes]} {ano}
          </div>
          <button onClick={() => setMes(m => m === 11 ? 0 : m + 1)} style={{
            background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8,
            padding: '6px 12px', cursor: 'pointer', fontFamily: "'Nunito',sans-serif", fontSize: 12,
          }}>Próximo →</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontWeight: 700, fontSize: 11,
              color: '#666', fontFamily: "'Nunito',sans-serif", padding: '6px 0',
            }}>{d}</div>
          ))}

          {Array(primeiroDia).fill(null).map((_, i) => (
            <div key={`vazio-${i}`}></div>
          ))}

          {Array(diasMes).fill(null).map((_, i) => {
            const dia = i + 1;
            const chave = `${ano}-${mes}-${dia}`;
            const eventosDay = eventos[chave] || [];
            const isToday = new Date().getDate() === dia && new Date().getMonth() === mes;

            return (
              <div
                key={dia}
                onClick={() => { setView('dia'); setDiaSelected(dia); }}
                style={{
                  background: isToday ? 'rgba(255,200,100,0.3)' : 'rgba(255,255,255,0.5)',
                  border: isToday ? '2px solid #FFD700' : '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 10, padding: '6px 4px', minHeight: 60,
                  cursor: 'pointer', transition: 'all .15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = isToday ? 'rgba(255,200,100,0.3)' : 'rgba(255,255,255,0.5)'}
              >
                <span style={{
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                  fontSize: 12, color: isToday ? '#FF9800' : '#666',
                }}>{dia}</span>
                <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {eventosDay.slice(0, 3).map(ev => (
                    <div key={ev.id} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: ev.cor,
                    }}></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Btn onClick={() => setView('dia')} color={COLORS.rosa} text="#fff" style={{ marginTop: 8 }}>
          Ver dia em detalhe →
        </Btn>
      </CardBase>
    );
  }

  if (view === 'dia') {
    const chave = `${ano}-${mes}-${diaSelected}`;
    const eventosDay = eventos[chave] || [];

    return (
      <CardBase color={COLORS.amarelo} icon="📆" title={`${diaSelected} de ${MESES[mes]}`} minH={340}>
        <Btn onClick={() => setView('mes')} small style={{ alignSelf: 'flex-start' }}>
          ← Voltar
        </Btn>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Input value={novoEvento} onChange={setNovoEvento} placeholder="Novo compromisso..." style={{ flex: 1, minWidth: 120 }} />
          <input type="time" value={horaEvento} onChange={e => setHoraEvento(e.target.value)} style={{
            border: 'none', background: 'rgba(255,255,255,0.5)', borderRadius: 8,
            padding: '5px 8px', fontSize: 11, fontFamily: "'Nunito',sans-serif", color: '#444',
          }} />
          <select value={corEvento} onChange={e => setCorEvento(e.target.value)} style={{
            border: 'none', background: corEvento, borderRadius: 8,
            padding: '5px 8px', fontSize: 11, fontFamily: "'Nunito',sans-serif", color: '#333',
            fontWeight: 700,
          }}>
            <option value={COLORS.rosa}>🌸 Rosa</option>
            <option value={COLORS.azul}>💙 Azul</option>
            <option value={COLORS.menta}>🌿 Menta</option>
            <option value={COLORS.amarelo}>⭐ Amarelo</option>
          </select>
          <Btn onClick={addEvento} color="rgba(255,255,255,0.7)" small>+ Adicionar</Btn>
        </div>

        <div style={{
          maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {eventosDay.sort((a, b) => a.hora.localeCompare(b.hora)).map(ev => (
            <div key={ev.id} style={{
              background: ev.cor, borderRadius: 12, padding: '8px 12px',
              borderLeft: `4px solid rgba(0,0,0,0.2)`, opacity: ev.feito ? 0.6 : 1,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <input type="checkbox" checked={ev.feito} onChange={() => toggleEvento(chave, ev.id)} style={{ cursor: 'pointer' }} />
              <span style={{
                fontSize: 10, color: '#666', fontFamily: "'Nunito',sans-serif",
                minWidth: 40,
              }}>{ev.hora}</span>
              <span style={{
                flex: 1, fontSize: 12, fontFamily: "'Nunito',sans-serif", color: '#333',
                textDecoration: ev.feito ? 'line-through' : 'none',
              }}>{ev.texto}</span>
              <button onClick={() => removeEvento(chave, ev.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#999',
              }}>✕</button>
            </div>
          ))}
          {eventosDay.length === 0 && (
            <div style={{
              textAlign: 'center', fontSize: 12, color: '#999',
              fontFamily: "'Nunito',sans-serif", paddingTop: 20,
            }}>Nenhum compromisso neste dia 🌸</div>
          )}
        </div>
      </CardBase>
    );
  }
}

function MedicamentosComFoto({ meds, setMeds }) {
  const [mostraForm, setMostraForm] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [msgStatus, setMsgStatus] = useState('');
  const fileInputRef = useRef(null);

  async function processarFoto(file) {
    if (!file) return;

    setProcessando(true);
    setMsgStatus('📸 Analisando foto...');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1];

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
                },
                {
                  type: 'text',
                  text: `Analise esta foto de medicamento/suplemento e extraia APENAS em formato JSON:
{
  "nome": "nome do medicamento",
  "dose": "dose/concentração",
  "quantidade": número de unidades na embalagem,
  "tipo": "medicamento" ou "suplemento"
}

Responda APENAS com JSON, nada mais.`,
                },
              ],
            }],
          }),
        });

        const data = await response.json();
        const texto = data.content[0].type === 'text' ? data.content[0].text : '';
        const jsonMatch = texto.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const info = JSON.parse(jsonMatch[0]);
          const novoMed = {
            id: uid(),
            nome: info.nome,
            dose: info.dose,
            qtdTotal: info.quantidade || 30,
            qtdUsada: 0,
            tipo: info.tipo,
            dataCompra: new Date().toLocaleDateString('pt-BR'),
          };
          const medsAtualizado = [...meds, novoMed];
          setMeds(medsAtualizado);
          set(ref(database, 'medicamentos'), medsAtualizado);
          setMsgStatus('✅ Medicamento adicionado!');
          setTimeout(() => { setMsgStatus(''); setMostraForm(false); }, 2000);
        } else {
          setMsgStatus('❌ Não consegui ler a embalagem. Tente outra foto.');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setMsgStatus('❌ Erro ao processar. Verifique sua conexão.');
    } finally {
      setProcessando(false);
    }
  }

  function marcarTomado(id) {
    const medsAtualizado = meds.map(x => x.id === id ? { ...x, qtdUsada: x.qtdUsada + 1 } : x);
    setMeds(medsAtualizado);
    set(ref(database, 'medicamentos'), medsAtualizado);
  }

  function remove(id) {
    const medsAtualizado = meds.filter(x => x.id !== id);
    setMeds(medsAtualizado);
    set(ref(database, 'medicamentos'), medsAtualizado);
  }

  const emAlerta = meds.filter(m => {
    const restante = m.qtdTotal - m.qtdUsada;
    return restante <= 5 && restante > 0;
  });

  const acabou = meds.filter(m => m.qtdTotal - m.qtdUsada <= 0);

  return (
    <CardBase color={COLORS.rosa} icon="💊" title="Medicamentos & Suplementos" minH={320}>
      {emAlerta.length > 0 && (
        <div style={{
          background: '#FFF3CD', borderRadius: 10, padding: '8px 12px',
          fontSize: 12, fontFamily: "'Nunito',sans-serif", color: '#856404',
          borderLeft: '4px solid #FFC107',
        }}>
          ⚠️ {emAlerta.length} medicamento(s) com estoque baixo!
        </div>
      )}

      {acabou.length > 0 && (
        <div style={{
          background: '#F8D7DA', borderRadius: 10, padding: '8px 12px',
          fontSize: 12, fontFamily: "'Nunito',sans-serif", color: '#721C24',
          borderLeft: '4px solid #DC3545',
        }}>
          🚨 {acabou.length} medicamento(s) para comprar!
        </div>
      )}

      <div style={{ display: 'flex', gap: 6 }}>
        <Btn onClick={() => setMostraForm(!mostraForm)} color={COLORS.salmão} text="#fff">
          📸 + Foto
        </Btn>
        <Btn onClick={() => setMostraForm(false)} color="rgba(255,255,255,0.6)" small>
          ✓ Fechar
        </Btn>
      </div>

      {mostraForm && (
        <div style={{
          background: 'rgba(255,255,255,0.5)', borderRadius: 12, padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={e => processarFoto(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
          <Btn
            onClick={() => fileInputRef.current?.click()}
            color={COLORS.azul}
            text="#fff"
            style={{ width: '100%' }}
          >
            {processando ? '⏳ Processando...' : '📷 Tirar/Selecionar Foto'}
          </Btn>
          {msgStatus && (
            <div style={{
              fontSize: 12, fontFamily: "'Nunito',sans-serif",
              color: msgStatus.includes('✅') ? '#2e7d32' : '#c62828',
              textAlign: 'center',
            }}>{msgStatus}</div>
          )}
        </div>
      )}

      <div style={{
        maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {meds.map(m => {
          const restante = m.qtdTotal - m.qtdUsada;
          const percentual = (restante / m.qtdTotal) * 100;
          const alertaEstoque = restante <= 5 ? '#FF6B6B' : restante <= 10 ? '#FFA500' : '#4CAF50';

          return (
            <div key={m.id} style={{
              background: m.tipo === 'medicamento' ? 'rgba(255,200,200,0.4)' : 'rgba(200,255,200,0.4)',
              borderRadius: 10, padding: '10px 12px',
              borderLeft: `4px solid ${alertaEstoque}`,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif", color: '#333',
                  }}>{m.nome}</div>
                  <div style={{
                    fontSize: 11, color: '#666', fontFamily: "'Nunito',sans-serif",
                  }}>{m.dose} · {m.tipo}</div>
                </div>
                <button onClick={() => marcarTomado(m.id)} style={{
                  background: 'rgba(255,255,255,0.7)', border: 'none',
                  borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
                  fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700,
                  color: '#666',
                }}>✓ Tomei</button>
                <button onClick={() => remove(m.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#bbb',
                }}>✕</button>
              </div>

              <div style={{ marginTop: 6 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 10, fontFamily: "'Nunito',sans-serif", color: '#666', marginBottom: 3,
                }}>
                  <span>{restante}/{m.qtdTotal}</span>
                  <span>{percentual.toFixed(0)}%</span>
                </div>
                <div style={{
                  height: 6, background: 'rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', background: alertaEstoque, width: `${percentual}%`,
                    transition: 'width .3s',
                  }}></div>
                </div>
              </div>
            </div>
          );
        })}
        {meds.length === 0 && (
          <div style={{
            textAlign: 'center', fontSize: 12, color: '#999',
            fontFamily: "'Nunito',sans-serif", paddingTop: 16,
          }}>Nenhum medicamento adicionado 📸</div>
        )}
      </div>
    </CardBase>
  );
}

function FinancasFamiliares({ financas, setFinancas }) {
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('saída');
  const [pessoa, setPessoa] = useState('você');

  function add() {
    if (!desc.trim() || !valor) return;
    const novoLancamento = {
      id: uid(), desc, valor: parseFloat(valor), tipo, pessoa,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    const financasAtualizado = [novoLancamento, ...financas];
    setFinancas(financasAtualizado);
    set(ref(database, 'financas'), financasAtualizado);
    setDesc(''); setValor('');
  }

  function remove(id) {
    const financasAtualizado = financas.filter(x => x.id !== id);
    setFinancas(financasAtualizado);
    set(ref(database, 'financas'), financasAtualizado);
  }

  const entradas = financas.filter(f => f.tipo === 'entrada').reduce((a, b) => a + b.valor, 0);
  const saidas = financas.filter(f => f.tipo === 'saída').reduce((a, b) => a + b.valor, 0);
  const saldo = entradas - saidas;

  const saidaVoce = financas.filter(f => f.tipo === 'saída' && f.pessoa === 'você').reduce((a, b) => a + b.valor, 0);
  const saidaMario = financas.filter(f => f.tipo === 'saída' && f.pessoa === 'marido').reduce((a, b) => a + b.valor, 0);
  const saidaMae = financas.filter(f => f.tipo === 'saída' && f.pessoa === 'mãe').reduce((a, b) => a + b.valor, 0);

  return (
    <CardBase color={COLORS.azul} icon="💰" title="Finanças Familiares" minH={300}>
      <div style={{
        background: 'rgba(255,255,255,0.5)', borderRadius: 12, padding: '12px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#555', fontFamily: "'Nunito',sans-serif" }}>Você</div>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#c62828',
            fontFamily: "'Nunito',sans-serif",
          }}>R$ {saidaVoce.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#555', fontFamily: "'Nunito',sans-serif" }}>Marido</div>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#c62828',
            fontFamily: "'Nunito',sans-serif",
          }}>R$ {saidaMario.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#555', fontFamily: "'Nunito',sans-serif" }}>Mãe</div>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#c62828',
            fontFamily: "'Nunito',sans-serif",
          }}>R$ {saidaMae.toFixed(2)}</div>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: '8px 12px',
        display: 'flex', justifyContent: 'space-around', textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: 10, color: '#555', fontFamily: "'Nunito',sans-serif" }}>Entradas</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32', fontFamily: "'Nunito',sans-serif" }}>
            R$ {entradas.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#555', fontFamily: "'Nunito',sans-serif" }}>Saídas</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#c62828', fontFamily: "'Nunito',sans-serif" }}>
            R$ {saidas.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#555', fontFamily: "'Nunito',sans-serif" }}>Saldo</div>
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: saldo >= 0 ? '#2e7d32' : '#c62828',
            fontFamily: "'Nunito',sans-serif",
          }}>R$ {saldo.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Input value={desc} onChange={setDesc} placeholder="Descrição" style={{ flex: 1, minWidth: 100 }} />
        <Input value={valor} onChange={setValor} placeholder="R$" type="number" style={{ width: 70 }} />
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{
          border: 'none', background: 'rgba(255,255,255,0.6)', borderRadius: 8,
          padding: '5px 8px', fontSize: 11, fontFamily: "'Nunito',sans-serif", color: '#444',
        }}>
          <option value="entrada">⬆ Entrada</option>
          <option value="saída">⬇ Saída</option>
        </select>
        <select value={pessoa} onChange={e => setPessoa(e.target.value)} style={{
          border: 'none', background: 'rgba(255,255,255,0.6)', borderRadius: 8,
          padding: '5px 8px', fontSize: 11, fontFamily: "'Nunito',sans-serif", color: '#444',
        }}>
          <option value="você">Você</option>
          <option value="marido">Marido</option>
          <option value="mãe">Mãe</option>
        </select>
        <Btn onClick={add} color="rgba(255,255,255,0.7)" small>+</Btn>
      </div>

      <div style={{
        maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5,
      }}>
        {financas.slice(0, 15).map(f => (
          <div key={f.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.45)', borderRadius: 9, padding: '5px 10px',
            fontSize: 11, fontFamily: "'Nunito',sans-serif",
          }}>
            <span>{f.tipo === 'entrada' ? '⬆️' : '⬇️'}</span>
            <span style={{ flex: 1, color: '#333' }}>{f.desc}</span>
            <span style={{ color: f.tipo === 'entrada' ? '#2e7d32' : '#c62828', fontWeight: 700 }}>
              {f.tipo === 'entrada' ? '+' : '-'}R${f.valor.toFixed(2)}
            </span>
            <span style={{ color: '#999', minWidth: 50 }}>{f.pessoa}</span>
            <button onClick={() => remove(f.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#bbb',
            }}>✕</button>
          </div>
        ))}
      </div>
    </CardBase>
  );
}

function PastaModelos({ modelos, setModelos }) {
  const [url, setUrl] = useState('');
  const [titulo, setTitulo] = useState('');
  const [nota, setNota] = useState('');

  function add() {
    if (!url.trim() || !titulo.trim()) return;
    const novoModelo = {
      id: uid(), titulo, url, nota,
      dataSalva: new Date().toLocaleDateString('pt-BR'),
    };
    const modelosAtualizado = [novoModelo, ...modelos];
    setModelos(modelosAtualizado);
    set(ref(database, 'modelos'), modelosAtualizado);
    setUrl(''); setTitulo(''); setNota('');
  }

  function remove(id) {
    const modelosAtualizado = modelos.filter(x => x.id !== id);
    setModelos(modelosAtualizado);
    set(ref(database, 'modelos'), modelosAtualizado);
  }

  return (
    <CardBase color={COLORS.pêssego} icon="📁" title="Pasta de Modelos & Inspirações" minH={280}>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Input value={titulo} onChange={setTitulo} placeholder="Título" style={{ flex: 1, minWidth: 100 }} />
        <Input value={url} onChange={setUrl} placeholder="URL" style={{ flex: 1, minWidth: 150 }} />
        <Btn onClick={add} color="rgba(255,255,255,0.7)" small>+ Salvar</Btn>
      </div>

      <textarea
        value={nota} onChange={e => setNota(e.target.value)}
        placeholder="Nota sobre este link..." rows={2}
        style={{
          border: 'none', background: 'rgba(255,255,255,0.5)', borderRadius: 8,
          padding: '6px 10px', fontSize: 11, fontFamily: "'Nunito',sans-serif",
          resize: 'none', color: '#444', outline: 'none', width: '100%',
          boxSizing: 'border-box',
        }}
      />

      <div style={{
        maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {modelos.map(m => (
          <a
            key={m.id}
            href={m.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              background: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '8px 12px',
              textDecoration: 'none', cursor: 'pointer', transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <span style={{
                fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                fontSize: 12, color: '#333',
              }}>{m.titulo}</span>
              <button
                onClick={e => { e.preventDefault(); remove(m.id); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: '#bbb',
                }}>✕</button>
            </div>
            {m.nota && (
              <div style={{
                fontSize: 10, color: '#666', fontFamily: "'Nunito',sans-serif",
                fontStyle: 'italic',
              }}>{m.nota}</div>
            )}
            <span style={{
              fontSize: 9, color: '#999', fontFamily: "'Nunito',sans-serif",
              wordBreak: 'break-all',
            }}>{m.url.substring(0, 60)}...</span>
          </a>
        ))}
        {modelos.length === 0 && (
          <div style={{
            textAlign: 'center', fontSize: 12, color: '#999',
            fontFamily: "'Nunito',sans-serif", paddingTop: 16,
          }}>Nenhum modelo salvo ainda 📌</div>
        )}
      </div>
    </CardBase>
  );
}

export default function Home() {
  const [eventos, setEventos] = useState({});
  const [meds, setMeds] = useState([]);
  const [financas, setFinancas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const eventosRef = ref(database, 'eventos');
    const medsRef = ref(database, 'medicamentos');
    const financasRef = ref(database, 'financas');
    const modelosRef = ref(database, 'modelos');

    Promise.all([
      get(eventosRef),
      get(medsRef),
      get(financasRef),
      get(modelosRef),
    ]).then(([eventosSnap, medsSnap, financasSnap, modelosSnap]) => {
      if (eventosSnap.exists()) setEventos(eventosSnap.val());
      if (medsSnap.exists()) setMeds(medsSnap.val());
      if (financasSnap.exists()) setFinancas(financasSnap.val());
      if (modelosSnap.exists()) setModelos(modelosSnap.val());
      setCarregando(false);
    });
  }, []);

  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #fff5f8 0%, #f0f8ff 50%, #f5fff8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Nunito', sans-serif",
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🧠</div>
          <div style={{ fontSize: 14 }}>Carregando seu Segundo Cérebro...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fff5f8 0%, #f0f8ff 50%, #f5fff8 100%)',
      padding: '20px 16px',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFB3C6 0%, #C3B1E1 35%, #AED9E0 65%, #B5EAD7 100%)',
          borderRadius: 24, padding: '22px 28px', marginBottom: 24,
          boxShadow: '0 8px 28px rgba(180,140,200,0.2)',
        }}>
          <div style={{
            fontFamily: "'Fredoka One', cursive", fontSize: 32, color: '#333',
            letterSpacing: 1,
          }}>🧠 Segundo Cérebro Premium</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 13, color: '#555',
            marginTop: 4,
          }}>Calendário · Medicamentos · Finanças Familiares · Modelos</div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}>
          <CalendarioInteligente eventos={eventos} setEventos={setEventos} />
          <MedicamentosComFoto meds={meds} setMeds={setMeds} />
          <FinancasFamiliares financas={financas} setFinancas={setFinancas} />
          <PastaModelos modelos={modelos} setModelos={setModelos} />
        </div>

        <div style={{
          textAlign: 'center', fontSize: 12, color: '#bbb',
          fontFamily: "'Nunito',sans-serif", paddingTop: 16,
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          🔥 Sincronizado com Firebase · 🧠 Segundo Cérebro Premium · Feito com 💜
        </div>
      </div>
    </div>
  );
}
