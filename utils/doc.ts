export async function getDocs() {
  try {
    const response = await fetch('/api/docs/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Pour éviter la mise en cache côté serveur
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des documents');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur GET:', error);
    return [];
  }
}

export async function postDoc(doc: {
  nom_doc: string;
  type_doc: string;
  url_doc: string;
}) {
  try {
    const response = await fetch('/api/docs/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doc),
    });

    if (!response.ok) {
      throw new Error('Échec de l\'ajout du document');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur POST:', error);
    return null;
  }
}