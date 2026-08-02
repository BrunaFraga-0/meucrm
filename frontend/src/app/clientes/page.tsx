"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string | null;
  observacoes: string | null;
  criadoEm: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mensagem, setMensagem] = useState("");

  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [clienteEmEdicao, setClienteEmEdicao] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    const fetchClientes = async (token: string) => {
      try {
        const url = buscaAplicada
          ? `http://localhost:3000/clientes?busca=${encodeURIComponent(buscaAplicada)}`
          : "http://localhost:3000/clientes";

        const resposta = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (resposta.status === 401) {
          localStorage.removeItem("token");
          router.replace("/");
          return;
        }

        if (!resposta.ok) {
          setMensagem("Não foi possível obter a lista de clientes.");
          return;
        }

        const dados = (await resposta.json()) as Cliente[];
        setClientes(dados);
      } catch {
        setMensagem("Não foi possível conectar ao servidor.");
      }
    };

    void fetchClientes(token);
  }, [router, buscaAplicada]);

  const buscar = (evento: SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setBuscaAplicada(busca.trim());
  };

  const sair = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  const cadastrar = async (evento: SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setMensagem("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    setSalvando(true);

    try {
      const url = clienteEmEdicao
      ? `http://localhost:3000/clientes/${clienteEmEdicao}`
      : "http://localhost:3000/clientes";

      const metodo = clienteEmEdicao ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          empresa: empresa || undefined,
          observacoes: observacoes || undefined,
        }),
      });

      if (resposta.status === 401) {
        localStorage.removeItem("token");
        router.replace("/");
        return;
      }

      if (!resposta.ok) {
        setMensagem(clienteEmEdicao
            ? "Não foi possível atualizar o cliente."
            : "Não foi possível cadastrar o cliente.",
        );
        return;
      }

      const clienteSalvo = (await resposta.json()) as Cliente;

      if (clienteEmEdicao) {
        setClientes((clientesAtuais) =>
          clientesAtuais.map((cliente) =>
            cliente.id === clienteEmEdicao ? clienteSalvo : cliente,
          ),
        );

        setMensagem("Cliente atualizado com sucesso.");
      } else {
        setClientes((clientesAtuais) => [...clientesAtuais, clienteSalvo]);
        setMensagem("Cliente cadastrado com sucesso.");
      }

      setClienteEmEdicao(null);
      setNome("");
      setEmail("");
      setTelefone("");
      setEmpresa("");
      setObservacoes("");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const editar = (cliente: Cliente) => {
    setClienteEmEdicao(cliente.id);
    setNome(cliente.nome);
    setEmail(cliente.email);
    setTelefone(cliente.telefone);
    setEmpresa(cliente.empresa ?? "");
    setObservacoes(cliente.observacoes ?? "");
    setMensagem("");
  };

  const cancelarEdicao = () => {
    setClienteEmEdicao(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setEmpresa("");
    setObservacoes("");
    setMensagem("");
  };

  const excluir = async (id: string) => {
    const confirmou = window.confirm(
      "Tem certeza de que deseja excluir este cliente?",
    );

    if (!confirmou) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resposta.status === 401) {
        localStorage.removeItem("token");
        router.replace("/");
        return;
      }

      if (!resposta.ok) {
        setMensagem("Não foi possível excluir o cliente.");
        return;
      }

      setClientes((clientesAtuais) =>
        clientesAtuais.filter((cliente) => cliente.id !== id),
      );

      setMensagem("Cliente excluído com sucesso.");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <main className={styles.main}>
        <section className={styles.telaClientes}>
          
          <header className={styles.cabecalho}>
            <h1 className={styles.titulo}>Clientes</h1>

            <h2 className={styles.subtitulo}>Sistema de Gerenciamento</h2>

            <button type="button" onClick={sair}>Sair</button>
          </header>

          <form onSubmit={buscar}>
            <label htmlFor="busca">Buscar cliente por nome</label>

            <input
              id="busca"
              type="search"
              placeholder="Digite o nome do cliente"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}/>

            <button type="submit">Buscar</button>

            <button type="button" onClick={() => {
              setBusca("");
              setBuscaAplicada("");
            }}>Limpar
            </button>
          </form>

          {mensagem && (<p className={styles.mensagemErro}>{mensagem}</p>)}

          <h3 className={styles.subtituloCadastroEdicao}>
            {clienteEmEdicao ? "Editar Cliente" : "Cadastrar Cliente"}
          </h3>

          <form onSubmit={cadastrar}>
            <div>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nome@dominio.com"
                title="Digite o email no formato nome@dominio.com"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(XX) 9XXXX-XXXX"
                pattern="\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}"
                title="Digite o telefone no formato (XX) 9XXXX-XXXX"
                value={telefone}
                onChange={(evento) => setTelefone(evento.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="empresa">Empresa</label>
              <input
                id="empresa"
                name="empresa"
                type="text"
                value={empresa}
                onChange={(evento) => setEmpresa(evento.target.value)}
              />
            </div>

            <div>
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={observacoes}
                onChange={(evento) => setObservacoes(evento.target.value)}
              />
            </div>
            
            <button type="submit" disabled={salvando}>
              {salvando? "Salvando..." : clienteEmEdicao ? "Salvar alterações" : "Cadastrar cliente"}
            </button>

            {clienteEmEdicao && (<button type="button" onClick={cancelarEdicao}>Cancelar edição</button>)}
          </form>

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Empresa</th>
                <th>Observações</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={6}>Nenhum cliente cadastrado.</td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.empresa ?? "-"}</td>
                    <td>{cliente.observacoes ?? "-"}</td>
                    <td>
                      <button type="button" onClick={() => editar(cliente)}>Editar</button>
                      <button type="button" onClick={() => excluir(cliente.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </section>
      </main>
  );
}