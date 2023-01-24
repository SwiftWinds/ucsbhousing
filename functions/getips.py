from dns import resolver
import ipaddress
import re


domain_pattern = re.compile(
    '(([\da-zA-Z_])([_\w-]{,62})\.){,127}(([\da-zA-Z])[_\w-]{,61})?([\da-zA-Z]\.((xn\-\-[a-zA-Z\d]+)|([a-zA-Z\d]{2,})))$', re.IGNORECASE)


def parse_spf(domain):
    ips = set()
    answers = resolver.query(domain.strip(), "TXT")
    for rdata in answers:
        splitted = rdata.to_text().split(' ')
        for split in splitted:
            split = split.strip()

            if split.startswith('ip4:') or split.startswith('ip6:'):
                split = split.lstrip('ip4:')
                split = split.lstrip('ip6:')

                try:
                    ipaddress.ip_address(split)
                    ips.add(split)
                    continue
                except ValueError:
                    pass

                try:
                    ipaddress.ip_network(split)
                    ips.add(split)
                    continue
                except ValueError:
                    pass

            if split.startswith('include:'):
                split = split.lstrip('include:')
                if domain_pattern.match(split):
                    ips.update(parse_spf(split))
                    continue

            print("Unrecognized entry", split)

    return ips


if __name__ == "__main__":
    domain = '_cloud-netblocks.googleusercontent.com'

    ips = parse_spf(domain=domain)

    for ip in ips:
        print(ip)
