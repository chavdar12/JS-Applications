export async function makeRequest(url, method, body, token) {
    if (method === undefined || method === '') {
        method = 'GET';
    }

    const methods = ['POST', 'PUT', 'DELETE'];
    let headers = {};

    if (methods.find(x => x.toLocaleUpperCase() === method.toLocaleUpperCase())) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['X-Authorization'] = token;
    }

    return await fetch(url, {
        method: method,
        headers,
        body: JSON.stringify(body)
    });
}
