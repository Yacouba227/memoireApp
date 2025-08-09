"use client";

import { useState, useEffect } from "react";
import Layout from "components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/Card";
import { Button } from "components/ui/Button";
import { Input } from "components/ui/Input";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getAllSessions, type Session } from "utils/session";
import { toast } from "sonner";

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const sessionsData = await getAllSessions();
        setSessions(sessionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des sessions:", error);
        setError("Erreur lors du chargement des sessions");
        toast.error("Erreur lors du chargement des sessions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getStatusIcon = (date: string) => {
    const sessionDate = new Date(date);
    const now = new Date();

    if (sessionDate < now) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (sessionDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      // Dans les 24h
      return <AlertCircle className="w-4 h-4 text-blue-600" />;
    } else {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (date: string) => {
    const sessionDate = new Date(date);
    const now = new Date();

    if (sessionDate < now) {
      return "bg-green-100 text-green-800";
    } else if (sessionDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      // Dans les 24h
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (date: string) => {
    const sessionDate = new Date(date);
    const now = new Date();

    if (sessionDate < now) {
      return "terminée";
    } else if (sessionDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      // Dans les 24h
      return "prochaine";
    } else {
      return "planifiée";
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des sessions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
            <p className="text-gray-600">Gestion des sessions du conseil</p>
          </div>
          <Link href="/sessions/nouvelle">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle session
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par président ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des sessions */}
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(session.date_session)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Session du{" "}
                            {new Date(session.date_session).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </h3>
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{session.lieu}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Président: {session.president}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {session.ordresDuJour.length} ordres du jour
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        session.date_session
                      )}`}
                    >
                      {getStatusText(session.date_session)}
                    </span>
                    <Link href={`/sessions/${session.id}`}>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune session trouvée
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Aucune session ne correspond à votre recherche."
                  : "Aucune session n'a été créée pour le moment."}
              </p>
              <Link href="/sessions/nouvelle">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la première session
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}