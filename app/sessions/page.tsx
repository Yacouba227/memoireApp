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
import { getAllSessions, deleteSession, updateSession, type Session, type SessionData } from "utils/session";
import { toast } from "sonner";
import { useAuth } from "contexts/AuthContext";
import { Edit, Trash2 } from "lucide-react";
import SessionModal from "components/sessions/SessionModal";

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSessionToEdit, setCurrentSessionToEdit] = useState<Session | null>(null);

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
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Chargement des sessions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
              Réessayer
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)] rounded-lg shadow-inner">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Sessions</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {user?.profil_utilisateur === 'admin' 
                ? 'Gestion des sessions du conseil' 
                : 'Consultation des sessions du conseil'
              }
            </p>
          </div>
          {user?.profil_utilisateur === 'admin' && (
            <Link href="/sessions/nouvelle">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle session
              </Button>
            </Link>
          )}
        </div>

        {/* Barre de recherche */}
        <Card className="dark:bg-gray-700 dark:border-gray-600">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Rechercher par président ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des sessions */}
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <Card
              key={session.id_session}
              className="hover:shadow-md transform transition-transform hover:scale-105 duration-200 dark:bg-gray-700 dark:border-gray-600"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(session.date_session)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span>{session.lieu}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span>Président: {session.president}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span>
                                {session.ordresDuJour?.length || 0} ordres du jour
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
                      )} dark:bg-opacity-20`}
                    >
                      {getStatusText(session.date_session)}
                    </span>
                    <Link href={`/sessions/${session.id_session}`}>
                      <Button variant="outline" size="sm" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                        Voir détails
                      </Button>
                    </Link>
                    {user?.profil_utilisateur === 'admin' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentSessionToEdit(session);
                            setIsEditModalOpen(true);
                          }}
                          className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (confirm('Supprimer cette session ?')) {
                              try {
                                await deleteSession(session.id_session)
                                toast.success('Session supprimée')
                                setSessions((prev) => prev.filter(s => s.id_session !== session.id_session))
                              } catch (err: any) {
                                console.error(err)
                                toast.error(err.message || 'Suppression impossible')
                              }
                            }
                          }}
                          className="dark:hover:bg-red-900 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune session trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm
                  ? "Aucune session ne correspond à votre recherche."
                  : "Aucune session n'a été créée pour le moment."}
              </p>
              <Link href="/sessions/nouvelle">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la première session
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      <SessionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        session={currentSessionToEdit}
        mode="edit"
        onSave={async (updatedSession) => {
          try {
            const sessionDataToUpdate: SessionData = {
              titre_session: updatedSession.titre_session,
              date_session: updatedSession.date_session,
              lieu: updatedSession.lieu,
              president: updatedSession.president,
              statut_session: updatedSession.statut_session, // Correction: utiliser statut_session
              duree_prevue: updatedSession.duree_prevue,
              quorum_requis: updatedSession.quorum_requis,
              ordresDuJour: updatedSession.ordresDuJour || [], // S'assurer que ordresDuJour est un tableau
            };
            const fetchedSession = await updateSession(updatedSession.id_session!, sessionDataToUpdate);
            
            if (fetchedSession) {
              setSessions((prev) =>
                prev.map((session) =>
                  session.id_session === fetchedSession.id_session ? fetchedSession : session
                )
              );
              toast.success("Session modifiée avec succès");
              setIsEditModalOpen(false);
            } else {
              toast.error("Erreur lors de la récupération de la session mise à jour.");
            }
          } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur lors de la modification de la session");
          }
        }}
      />
    </Layout>
  );
}