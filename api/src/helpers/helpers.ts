const validateDomain = (domain: string) => {
    if (!domain) return false;
    return domain.match("^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}")
}

export default {
    validateDomain
}