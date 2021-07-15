def handler(request): 
    headers = {
        'Content-Type': 'text/plain'
    }

    return ('Hello, World!  Welcome to Google Native in Python via Pulumi!', 200, headers)