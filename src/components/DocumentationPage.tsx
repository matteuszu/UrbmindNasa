import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Map, Code, Database, Users, Settings } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar ao App</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold">Documentação UrbMind</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-24 space-y-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Navegação
              </h3>
              <a href="#overview" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Visão Geral
              </a>
              <a href="#features" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Funcionalidades
              </a>
              <a href="#tech-stack" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Stack Tecnológico
              </a>
              <a href="#api" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                API & Integrações
              </a>
              <a href="#deployment" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Deploy
              </a>
              <a href="#contributing" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Contribuindo
              </a>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-invert max-w-none">
              {/* Overview Section */}
              <section id="overview" className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Book className="h-8 w-8 mr-3 text-blue-400" />
                  Visão Geral
                </h2>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <p className="text-lg text-slate-300 mb-4">
                    O UrbMind é uma aplicação web moderna que combina visualização de mapas interativos 
                    com funcionalidades de localização e análise urbana. A aplicação oferece uma interface 
                    intuitiva para explorar dados geográficos e informações contextuais sobre diferentes 
                    localidades.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <Map className="h-6 w-6 text-green-400 mb-2" />
                      <h4 className="font-semibold mb-2">Mapas Interativos</h4>
                      <p className="text-sm text-slate-400">Visualização avançada com Mapbox GL</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <Users className="h-6 w-6 text-blue-400 mb-2" />
                      <h4 className="font-semibold mb-2">Interface Moderna</h4>
                      <p className="text-sm text-slate-400">Design responsivo e acessível</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <Database className="h-6 w-6 text-purple-400 mb-2" />
                      <h4 className="font-semibold mb-2">Dados em Tempo Real</h4>
                      <p className="text-sm text-slate-400">Integração com APIs externas</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section id="features" className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Settings className="h-8 w-8 mr-3 text-green-400" />
                  Funcionalidades
                </h2>
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold mb-3 text-blue-400">Sistema de Mapas</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Visualização de mapas com Mapbox GL JS</li>
                      <li>• Controles de zoom e navegação</li>
                      <li>• Marcadores personalizados</li>
                      <li>• Geolocalização do usuário</li>
                      <li>• Estilos de mapa customizáveis</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold mb-3 text-green-400">Interface do Usuário</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Design responsivo com Tailwind CSS</li>
                      <li>• Componentes UI com Radix UI</li>
                      <li>• Tema escuro por padrão</li>
                      <li>• Animações suaves</li>
                      <li>• Carrossel de conteúdo</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold mb-3 text-purple-400">Funcionalidades Avançadas</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Modo Lab para funcionalidades experimentais</li>
                      <li>• Seção inferior expansível</li>
                      <li>• Controles de localização</li>
                      <li>• Sistema de notificações</li>
                      <li>• Integração com Supabase</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tech Stack Section */}
              <section id="tech-stack" className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Code className="h-8 w-8 mr-3 text-yellow-400" />
                  Stack Tecnológico
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Frontend</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>• <strong>React 18</strong> - Biblioteca principal</li>
                      <li>• <strong>TypeScript</strong> - Tipagem estática</li>
                      <li>• <strong>Vite</strong> - Build tool e dev server</li>
                      <li>• <strong>Tailwind CSS</strong> - Estilização</li>
                      <li>• <strong>Radix UI</strong> - Componentes acessíveis</li>
                      <li>• <strong>React Router DOM</strong> - Roteamento</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-green-400">Integrações</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>• <strong>Mapbox GL JS</strong> - Mapas interativos</li>
                      <li>• <strong>Supabase</strong> - Backend e autenticação</li>
                      <li>• <strong>Lucide React</strong> - Ícones</li>
                      <li>• <strong>Lottie React</strong> - Animações</li>
                      <li>• <strong>React Hook Form</strong> - Formulários</li>
                      <li>• <strong>Embla Carousel</strong> - Carrosséis</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* API Section */}
              <section id="api" className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Database className="h-8 w-8 mr-3 text-red-400" />
                  API & Integrações
                </h2>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">Mapbox Integration</h3>
                  <p className="text-slate-300 mb-4">
                    A aplicação utiliza o Mapbox GL JS para renderização de mapas. A configuração 
                    é gerenciada através do arquivo de configuração dedicado.
                  </p>
                  <div className="bg-slate-900/50 rounded p-4 mb-4">
                    <code className="text-sm text-green-400">
                      src/config/mapbox.ts
                    </code>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-green-400 mt-6">Supabase Backend</h3>
                  <p className="text-slate-300 mb-4">
                    Integração com Supabase para autenticação, banco de dados e funções serverless.
                  </p>
                  <div className="bg-slate-900/50 rounded p-4">
                    <code className="text-sm text-green-400">
                      src/utils/supabase/client.tsx
                    </code>
                  </div>
                </div>
              </section>

              {/* Deployment Section */}
              <section id="deployment" className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Settings className="h-8 w-8 mr-3 text-orange-400" />
                  Deploy
                </h2>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">Scripts Disponíveis</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <code className="text-sm text-green-400">npm run dev</code>
                      <p className="text-xs text-slate-400 mt-1">Inicia o servidor de desenvolvimento</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <code className="text-sm text-green-400">npm run build</code>
                      <p className="text-xs text-slate-400 mt-1">Gera build de produção</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <code className="text-sm text-green-400">npm run preview</code>
                      <p className="text-xs text-slate-400 mt-1">Preview do build de produção</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-green-400 mt-6">Variáveis de Ambiente</h3>
                  <p className="text-slate-300 mb-4">
                    Certifique-se de configurar as seguintes variáveis de ambiente:
                  </p>
                  <div className="bg-slate-900/50 rounded p-4">
                    <code className="text-sm text-green-400">
                      VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token<br/>
                      VITE_SUPABASE_URL=your_supabase_url<br/>
                      VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
                    </code>
                  </div>
                </div>
              </section>

              {/* Contributing Section */}
              <section id="contributing" className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Users className="h-8 w-8 mr-3 text-purple-400" />
                  Contribuindo
                </h2>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">Como Contribuir</h3>
                  <ol className="space-y-3 text-slate-300">
                    <li>1. Faça um fork do repositório</li>
                    <li>2. Crie uma branch para sua feature (<code className="bg-slate-700 px-2 py-1 rounded text-green-400">git checkout -b feature/nova-funcionalidade</code>)</li>
                    <li>3. Commit suas mudanças (<code className="bg-slate-700 px-2 py-1 rounded text-green-400">git commit -m 'Adiciona nova funcionalidade'</code>)</li>
                    <li>4. Push para a branch (<code className="bg-slate-700 px-2 py-1 rounded text-green-400">git push origin feature/nova-funcionalidade</code>)</li>
                    <li>5. Abra um Pull Request</li>
                  </ol>

                  <h3 className="text-lg font-semibold mb-4 text-green-400 mt-6">Padrões de Código</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Use TypeScript para tipagem</li>
                    <li>• Siga as convenções do ESLint/Prettier</li>
                    <li>• Escreva testes para novas funcionalidades</li>
                    <li>• Documente componentes complexos</li>
                    <li>• Mantenha a consistência com o design system</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 UrbMind. Documentação gerada automaticamente.</p>
            <p className="mt-2 text-sm">
              Para mais informações, consulte o repositório do projeto.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
