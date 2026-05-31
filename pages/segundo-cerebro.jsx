import { useState, useEffect, useCallback } from "react";

// ── Paleta pastel vibrante ──────────────────────────────────────────
const COLORS = {
  rosa:     "#FFB3C6",
  pêssego:  "#FFCBA4",
  amarelo:  "#FFF07C",
  menta:    "#B5EAD7",
  lavanda:  "#C3B1E1",
  azul:     "#AED9E0",
  lilás:    "#E8C5F5",
  salmão:   "#FFADA0",
};

const CARD_PALETTE = [COLORS.rosa, COLORS.menta, COLORS.amarelo, COLORS.lavanda, COLORS.azul, COLORS.pêssego, COLORS.lilás, COLORS.salmão];

// ── Utilidades ────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }

function Badge({ label, color }) {
  return (
    <span style={{
      background: color,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      fontWeight: 700,
      color: "#444",
      letterSpacing: 0.3,
    }}>{label}</span>
  );
}

function Card({ color, title, icon, children, minH = 220 }) {
  return (
    <div style={{
      background: color,
      borderRadius: 22,
      padding: "18px 20px",
      minHeight: minH,
      boxShadow: "0 4px 18px rgba(0,0,0,0.09)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "transform .18s",
      cursor: "default",
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontFamily:"'Fredoka One', cursive", fontSize: 17, color: "#333", display:"flex", alignItems:"center", gap: 7 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, style = {} }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: "none",
        borderBottom: "2px solid rgba(0,0,0,0.15)",
        background: "transparent",
        outline: "none",
        fontSize: 13,
        padding: "4px 2px",
        color: "#333",
        fontFamily: "'Nunito', sans-serif",
        width: "100%",
        ...style,
      }}
    />
  );
}

function Btn({ onClick, children, color = "#fff", text = "#444", small }) {
  return (
    <button onClick={onClick} style={{
      background: color,
      border: "none",
      borderRadius: 12,
      padding: small ? "4px 12px" : "7px 16px",
      fontSize: small ? 11 : 13,
      fontWeight: 700,
      color: text,
      cursor: "pointer",
      fontFamily: "'Nunito', sans-serif",
      boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
      transition: "opacity .15s",
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

// ── SEÇÃO: Humor / Energia ────────────────────────────────────────────
const HUMORES = [
  { e: "😄", l: "Ótimo" }, { e: "🙂", l: "Bem" },
  { e: "😐", l: "Ok" },   { e: "😔", l: "Difícil" },
  { e: "🥴", l: "Caos" },
];
const ENERGIAS = ["🔋🔋🔋", "🔋🔋", "🔋", "🪫"];

function HumorCard({ data, setData }) {
  return (
    <Card color={COLORS.amarelo} icon="🌈" title="Humor & Energia de Hoje">
      <div style={{ fontSize: 12, color: "#666", fontFamily:"'Nunito', sans-serif" }}>Como você está agora?</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {HUMORES.map(h => (
          <button key={h.e} onClick={() => setData(d => ({ ...d, humor: h.e }))} style={{
            fontSize: 26,
            background: data.humor === h.e ? "rgba(0,0,0,0.12)" : "transparent",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            padding: "4px 6px",
            transition: "transform .15s",
            transform: data.humor === h.e ? "scale(1.3)" : "scale(1)",
          }} title={h.l}>{h.e}</button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "#666", fontFamily:"'Nunito', sans-serif", marginTop: 4 }}>Energia:</div>
      <div style={{ display: "flex", gap: 8 }}>
        {ENERGIAS.map(e => (
          <button key={e} onClick={() => setData(d => ({ ...d, energia: e }))} style={{
            fontSize: 18,
            background: data.energia === e ? "rgba(0,0,0,0.12)" : "transparent",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transform: data.energia === e ? "scale(1.2)" : "scale(1)",
          }}>{e}</button>
        ))}
      </div>
      <textarea
        value={data.nota || ""}
        onChange={e => setData(d => ({ ...d, nota: e.target.value }))}
        placeholder="Nota rápida do dia... 💭"
        rows={2}
        style={{
          background: "rgba(255,255,255,0.45)",
          border: "none",
          borderRadius: 10,
          padding: "8px 10px",
          fontSize: 12,
          fontFamily: "'Nunito', sans-serif",
          resize: "none",
          color: "#444",
          outline: "none",
          marginTop: 4,
        }}
      />
    </Card>
  );
}

// ── SEÇÃO: Tarefas ────────────────────────────────────────────────────
const PRIORIDADES = { alta: COLORS.salmão, média: COLORS.pêssego, baixa: COLORS.menta };

function TarefasCard({ tarefas, setTarefas }) {
  const [texto, setTexto] = useState("");
  const [prio, setPrio] = useState("média");

  function add() {
    if (!texto.trim()) return;
    setTarefas(t => [{ id: uid(), texto, prio, feita: false }, ...t]);
    setTexto("");
  }

  function toggle(id) {
    setTarefas(t => t.map(x => x.id === id ? { ...x, feita: !x.feita } : x));
  }

  function remove(id) {
    setTarefas(t => t.filter(x => x.id !== id));
  }

  const abertas = tarefas.filter(t => !t.feita);
  const feitas = tarefas.filter(t => t.feita);

  return (
    <Card color={COLORS.menta} icon="✅" title="Tarefas & To-dos" minH={260}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Input value={texto} onChange={setTexto} placeholder="Nova tarefa..." style={{ flex: 1 }} />
        <select value={prio} onChange={e => setPrio(e.target.value)} style={{
          border: "none", background: "rgba(255,255,255,0.6)", borderRadius: 8,
          padding: "4px 6px", fontSize: 11, fontFamily:"'Nunito',sans-serif", color:"#444",
        }}>
          <option value="alta">🔴 Alta</option>
          <option value="média">🟡 Média</option>
          <option value="baixa">🟢 Baixa</option>
        </select>
        <Btn onClick={add} color="rgba(255,255,255,0.7)" small>＋</Btn>
      </div>

      <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
        {abertas.map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "6px 10px",
            borderLeft: `4px solid ${PRIORIDADES[t.prio]}`,
          }}>
            <input type="checkbox" checked={false} onChange={() => toggle(t.id)} style={{ cursor: "pointer" }} />
            <span style={{ flex: 1, fontSize: 12, fontFamily:"'Nunito',sans-serif", color:"#333" }}>{t.texto}</span>
            <button onClick={() => remove(t.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#aaa" }}>✕</button>
          </div>
        ))}
        {feitas.length > 0 && (
          <details>
            <summary style={{ fontSize: 11, color: "#666", cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              ✅ {feitas.length} concluída(s)
            </summary>
            {feitas.map(t => (
              <div key={t.id} style={{
                display:"flex", alignItems:"center", gap:7,
                background:"rgba(255,255,255,0.3)", borderRadius:10, padding:"5px 10px",
                opacity: 0.6,
              }}>
                <input type="checkbox" checked onChange={() => toggle(t.id)} style={{ cursor:"pointer" }} />
                <span style={{ flex:1, fontSize:11, fontFamily:"'Nunito',sans-serif", textDecoration:"line-through", color:"#666" }}>{t.texto}</span>
                <button onClick={() => remove(t.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#aaa" }}>✕</button>
              </div>
            ))}
          </details>
        )}
      </div>
      <div style={{ fontSize: 11, color: "#558", fontFamily:"'Nunito',sans-serif" }}>
        {abertas.length} pendente(s) · {feitas.length} feita(s)
      </div>
    </Card>
  );
}

// ── SEÇÃO: Rotina ─────────────────────────────────────────────────────
const PERIODOS = ["🌅 Manhã", "☀️ Tarde", "🌙 Noite"];

function RotinaCard({ rotina, setRotina }) {
  const [aba, setAba] = useState(0);
  const [novo, setNovo] = useState("");
  const [hora, setHora] = useState("");

  function add() {
    if (!novo.trim()) return;
    const periodo = PERIODOS[aba];
    setRotina(r => {
      const list = r[periodo] || [];
      return { ...r, [periodo]: [...list, { id: uid(), texto: novo, hora, feito: false }] };
    });
    setNovo(""); setHora("");
  }

  function toggle(periodo, id) {
    setRotina(r => ({
      ...r,
      [periodo]: r[periodo].map(x => x.id === id ? { ...x, feito: !x.feito } : x),
    }));
  }

  function remove(periodo, id) {
    setRotina(r => ({ ...r, [periodo]: r[periodo].filter(x => x.id !== id) }));
  }

  const periodo = PERIODOS[aba];
  const itens = rotina[periodo] || [];

  return (
    <Card color={COLORS.lavanda} icon="🗓️" title="Rotina Diária" minH={260}>
      <div style={{ display: "flex", gap: 5 }}>
        {PERIODOS.map((p, i) => (
          <button key={p} onClick={() => setAba(i)} style={{
            fontSize: 11, padding: "4px 10px",
            borderRadius: 10, border: "none",
            background: aba === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
            fontWeight: aba === i ? 700 : 400,
            cursor: "pointer",
            fontFamily: "'Nunito',sans-serif",
            color: "#444",
          }}>{p}</button>
        ))}
      </div>

      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
        <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{
          border:"none", background:"rgba(255,255,255,0.5)", borderRadius:8,
          padding:"4px 6px", fontSize:11, color:"#444", fontFamily:"'Nunito',sans-serif",
        }} />
        <Input value={novo} onChange={setNovo} placeholder="Adicionar atividade..." style={{ flex:1 }} />
        <Btn onClick={add} color="rgba(255,255,255,0.7)" small>＋</Btn>
      </div>

      <div style={{ maxHeight: 180, overflowY:"auto", display:"flex", flexDirection:"column", gap:5 }}>
        {itens.sort((a,b) => (a.hora||"").localeCompare(b.hora||"")).map(item => (
          <div key={item.id} style={{
            display:"flex", alignItems:"center", gap:7,
            background:"rgba(255,255,255,0.45)", borderRadius:10, padding:"6px 10px",
            opacity: item.feito ? 0.55 : 1,
          }}>
            <input type="checkbox" checked={item.feito} onChange={() => toggle(periodo, item.id)} style={{ cursor:"pointer" }} />
            {item.hora && <span style={{ fontSize:10, color:"#777", fontFamily:"'Nunito',sans-serif", minWidth:32 }}>{item.hora}</span>}
            <span style={{ flex:1, fontSize:12, fontFamily:"'Nunito',sans-serif", color:"#333",
              textDecoration: item.feito ? "line-through" : "none" }}>{item.texto}</span>
            <button onClick={() => remove(periodo, item.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#aaa" }}>✕</button>
          </div>
        ))}
        {itens.length === 0 && <div style={{ fontSize:12, color:"#888", fontFamily:"'Nunito',sans-serif", textAlign:"center", paddingTop:20 }}>Nada aqui ainda 🌸</div>}
      </div>
    </Card>
  );
}

// ── SEÇÃO: Medicamentos ───────────────────────────────────────────────
function MedsCard({ meds, setMeds }) {
  const [nome, setNome] = useState("");
  const [dose, setDose] = useState("");
  const [hora, setHora] = useState("");

  function add() {
    if (!nome.trim()) return;
    setMeds(m => [...m, { id: uid(), nome, dose, hora, tomado: false }]);
    setNome(""); setDose(""); setHora("");
  }

  function toggle(id) {
    setMeds(m => m.map(x => x.id === id ? { ...x, tomado: !x.tomado } : x));
  }

  function remove(id) {
    setMeds(m => m.filter(x => x.id !== id));
  }

  function resetAll() {
    setMeds(m => m.map(x => ({ ...x, tomado: false })));
  }

  const tomados = meds.filter(m => m.tomado).length;

  return (
    <Card color={COLORS.rosa} icon="💊" title="Medicamentos & Saúde" minH={240}>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>
        <Input value={nome} onChange={setNome} placeholder="Medicamento" style={{ width:100 }} />
        <Input value={dose} onChange={setDose} placeholder="Dose" style={{ width:60 }} />
        <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{
          border:"none", background:"rgba(255,255,255,0.5)", borderRadius:8,
          padding:"4px 5px", fontSize:11, color:"#444", fontFamily:"'Nunito',sans-serif",
        }} />
        <Btn onClick={add} color="rgba(255,255,255,0.7)" small>＋</Btn>
      </div>

      {meds.length > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#666", fontFamily:"'Nunito',sans-serif" }}>
            💊 {tomados}/{meds.length} tomado(s)
          </span>
          <Btn onClick={resetAll} color="rgba(255,255,255,0.5)" small>🔄 Resetar</Btn>
        </div>
      )}

      <div style={{ maxHeight:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:5 }}>
        {meds.map(m => (
          <div key={m.id} style={{
            display:"flex", alignItems:"center", gap:8,
            background: m.tomado ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.55)",
            borderRadius:10, padding:"7px 10px",
            opacity: m.tomado ? 0.6 : 1,
          }}>
            <button onClick={() => toggle(m.id)} style={{
              fontSize:18, background:"none", border:"none", cursor:"pointer",
            }}>{m.tomado ? "✅" : "⬜"}</button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:"#333" }}>{m.nome}</div>
              <div style={{ fontSize:10, color:"#666", fontFamily:"'Nunito',sans-serif" }}>
                {m.dose}{m.hora ? ` · ${m.hora}` : ""}
              </div>
            </div>
            <button onClick={() => remove(m.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#aaa" }}>✕</button>
          </div>
        ))}
        {meds.length === 0 && <div style={{ fontSize:12, color:"#999", fontFamily:"'Nunito',sans-serif", textAlign:"center", paddingTop:16 }}>Nenhum medicamento 🌸</div>}
      </div>
    </Card>
  );
}

// ── SEÇÃO: Finanças ───────────────────────────────────────────────────
function FinancasCard({ financas, setFinancas }) {
  const [desc, setDesc] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saída");

  function add() {
    if (!desc.trim() || !valor) return;
    setFinancas(f => [{ id: uid(), desc, valor: parseFloat(valor), tipo, data: new Date().toLocaleDateString("pt-BR") }, ...f]);
    setDesc(""); setValor("");
  }

  function remove(id) { setFinancas(f => f.filter(x => x.id !== id)); }

  const entradas = financas.filter(f => f.tipo === "entrada").reduce((a, b) => a + b.valor, 0);
  const saidas = financas.filter(f => f.tipo === "saída").reduce((a, b) => a + b.valor, 0);
  const saldo = entradas - saidas;

  return (
    <Card color={COLORS.azul} icon="💰" title="Finanças" minH={240}>
      <div style={{ display:"flex", gap:10, justifyContent:"space-between", background:"rgba(255,255,255,0.4)", borderRadius:12, padding:"8px 12px" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#555", fontFamily:"'Nunito',sans-serif" }}>Entradas</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#2e7d32", fontFamily:"'Nunito',sans-serif" }}>R$ {entradas.toFixed(2)}</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#555", fontFamily:"'Nunito',sans-serif" }}>Saídas</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#c62828", fontFamily:"'Nunito',sans-serif" }}>R$ {saidas.toFixed(2)}</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#555", fontFamily:"'Nunito',sans-serif" }}>Saldo</div>
          <div style={{ fontSize:14, fontWeight:700, color: saldo >= 0 ? "#2e7d32" : "#c62828", fontFamily:"'Nunito',sans-serif" }}>R$ {saldo.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>
        <Input value={desc} onChange={setDesc} placeholder="Descrição" style={{ flex:1, minWidth:80 }} />
        <Input value={valor} onChange={setValor} placeholder="R$" style={{ width:60 }} />
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{
          border:"none", background:"rgba(255,255,255,0.6)", borderRadius:8,
          padding:"4px 6px", fontSize:11, fontFamily:"'Nunito',sans-serif", color:"#444",
        }}>
          <option value="entrada">⬆ Entrada</option>
          <option value="saída">⬇ Saída</option>
        </select>
        <Btn onClick={add} color="rgba(255,255,255,0.7)" small>＋</Btn>
      </div>

      <div style={{ maxHeight:150, overflowY:"auto", display:"flex", flexDirection:"column", gap:4 }}>
        {financas.slice(0,20).map(f => (
          <div key={f.id} style={{
            display:"flex", alignItems:"center", gap:6,
            background:"rgba(255,255,255,0.45)", borderRadius:9, padding:"5px 10px",
          }}>
            <span style={{ fontSize:14 }}>{f.tipo === "entrada" ? "⬆️" : "⬇️"}</span>
            <span style={{ flex:1, fontSize:12, fontFamily:"'Nunito',sans-serif", color:"#333" }}>{f.desc}</span>
            <span style={{ fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif",
              color: f.tipo === "entrada" ? "#2e7d32" : "#c62828" }}>
              {f.tipo === "entrada" ? "+" : "-"}R${f.valor.toFixed(2)}
            </span>
            <span style={{ fontSize:10, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>{f.data}</span>
            <button onClick={() => remove(f.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#bbb" }}>✕</button>
          </div>
        ))}
        {financas.length === 0 && <div style={{ fontSize:12, color:"#999", fontFamily:"'Nunito',sans-serif", textAlign:"center", paddingTop:12 }}>Nenhum lançamento 🌸</div>}
      </div>
    </Card>
  );
}

// ── SEÇÃO: Projetos ───────────────────────────────────────────────────
const STATUS_OPTS = [
  { v: "ideia",      l: "💡 Ideia",     c: COLORS.amarelo },
  { v: "andamento",  l: "🚀 Em andamento", c: COLORS.azul },
  { v: "pausado",    l: "⏸ Pausado",    c: COLORS.pêssego },
  { v: "concluído",  l: "🏁 Concluído", c: COLORS.menta },
];

function ProjetosCard({ projetos, setProjetos }) {
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("ideia");
  const [desc, setDesc] = useState("");
  const [aberto, setAberto] = useState(null);

  function add() {
    if (!nome.trim()) return;
    setProjetos(p => [{ id: uid(), nome, status, desc, tarefas: [] }, ...p]);
    setNome(""); setDesc(""); setStatus("ideia");
  }

  function changeStatus(id, s) {
    setProjetos(p => p.map(x => x.id === id ? { ...x, status: s } : x));
  }

  function remove(id) { setProjetos(p => p.filter(x => x.id !== id)); setAberto(null); }

  return (
    <Card color={COLORS.pêssego} icon="🚀" title="Projetos & Trabalho" minH={240}>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
        <Input value={nome} onChange={setNome} placeholder="Nome do projeto" style={{ flex:1, minWidth:100 }} />
        <select value={status} onChange={e => setStatus(e.target.value)} style={{
          border:"none", background:"rgba(255,255,255,0.6)", borderRadius:8,
          padding:"4px 6px", fontSize:11, fontFamily:"'Nunito',sans-serif", color:"#444",
        }}>
          {STATUS_OPTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
        <Btn onClick={add} color="rgba(255,255,255,0.7)" small>＋</Btn>
      </div>

      <div style={{ maxHeight:220, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
        {projetos.map(p => {
          const s = STATUS_OPTS.find(x => x.v === p.status) || STATUS_OPTS[0];
          return (
            <div key={p.id} style={{
              background:"rgba(255,255,255,0.5)", borderRadius:12, padding:"8px 12px",
              borderLeft: `4px solid ${s.c}`,
              cursor:"pointer",
            }} onClick={() => setAberto(aberto === p.id ? null : p.id)}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ flex:1, fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:"#333" }}>{p.nome}</span>
                <Badge label={s.l} color={s.c} />
                <select
                  value={p.status}
                  onChange={e => { e.stopPropagation(); changeStatus(p.id, e.target.value); }}
                  onClick={e => e.stopPropagation()}
                  style={{ border:"none", background:"transparent", fontSize:10, color:"#666", cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}
                >
                  {STATUS_OPTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
                <button onClick={e => { e.stopPropagation(); remove(p.id); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#bbb" }}>✕</button>
              </div>
              {aberto === p.id && (
                <textarea
                  value={p.desc}
                  onChange={e => { e.stopPropagation(); setProjetos(ps => ps.map(x => x.id === p.id ? { ...x, desc: e.target.value } : x)); }}
                  onClick={e => e.stopPropagation()}
                  placeholder="Notas do projeto..."
                  rows={3}
                  style={{
                    marginTop:8, width:"100%", border:"none", background:"rgba(255,255,255,0.4)",
                    borderRadius:8, padding:"6px 8px", fontSize:12, fontFamily:"'Nunito',sans-serif",
                    resize:"none", color:"#444", outline:"none", boxSizing:"border-box",
                  }}
                />
              )}
            </div>
          );
        })}
        {projetos.length === 0 && <div style={{ fontSize:12, color:"#999", fontFamily:"'Nunito',sans-serif", textAlign:"center", paddingTop:20 }}>Sem projetos ainda 🌸</div>}
      </div>
    </Card>
  );
}

// ── CABEÇALHO ─────────────────────────────────────────────────────────
function Header() {
  const now = new Date();
  const hora = now.toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });
  const data = now.toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" });

  return (
    <div style={{
      background: "linear-gradient(135deg, #FFB3C6 0%, #C3B1E1 35%, #AED9E0 65%, #B5EAD7 100%)",
      borderRadius: 24,
      padding: "22px 28px",
      marginBottom: 20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 6px 24px rgba(180,140,200,0.22)",
    }}>
      <div>
        <div style={{ fontFamily:"'Fredoka One', cursive", fontSize: 28, color:"#333", letterSpacing:1 }}>
          🧠 Segundo Cérebro
        </div>
        <div style={{ fontFamily:"'Nunito', sans-serif", fontSize:13, color:"#555", marginTop:2, textTransform:"capitalize" }}>
          {data}
        </div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:32, color:"#444", lineHeight:1 }}>{hora}</div>
        <div style={{ fontFamily:"'Nunito', sans-serif", fontSize:11, color:"#777", marginTop:2 }}>
          ✨ Um dia de cada vez
        </div>
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ────────────────────────────────────────────────────
const STORAGE_KEY = "segundo-cerebro-v1";

const defaultState = {
  humor: { humor: "", energia: "", nota: "" },
  tarefas: [],
  rotina: {},
  meds: [],
  financas: [],
  projetos: [],
};

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch { return defaultState; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  function make(key) {
    return (updater) => setState(s => ({
      ...s,
      [key]: typeof updater === "function" ? updater(s[key]) : updater,
    }));
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fff5f8 0%, #f0f8ff 50%, #f5fff8 100%)",
      padding: "20px 16px",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Header />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          <HumorCard    data={state.humor}    setData={make("humor")} />
          <TarefasCard  tarefas={state.tarefas} setTarefas={make("tarefas")} />
          <MedsCard     meds={state.meds}     setMeds={make("meds")} />
          <RotinaCard   rotina={state.rotina}  setRotina={make("rotina")} />
          <FinancasCard financas={state.financas} setFinancas={make("financas")} />
          <ProjetosCard projetos={state.projetos} setProjetos={make("projetos")} />
        </div>

        <div style={{ textAlign:"center", marginTop:24, fontSize:12, color:"#bbb", fontFamily:"'Nunito',sans-serif" }}>
          💾 Salvo automaticamente · 🧠 Segundo Cérebro · feito com 💜
        </div>
      </div>
    </div>
  );
}
