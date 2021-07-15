def handler(request): 
    headers = {
        'Content-Type': 'text/plain'
    }

    return ('Hello, World for Google Native in Python!', 200, headers)