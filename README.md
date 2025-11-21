# interactive-api-erp

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
       <ul>
        <li><a href="#release-notes">Release Notes</a></li>
      </ul>
	</li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#additional-notes-and-disclaimer-from-gematik-gmbh">Additional Notes and Disclaimer</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Die gematik stellt hier technische Werkzeuge zur Verfügung, die bei der Implementierung der Schnittstellen rund um das E-Rezept unterstützen.

- [E-Rezept FD Communications](erp-fd-communications) enthält die JSON-Schemata für die Payloads, die bei der Übertragung von Communications im E-Rezept verwendet werden.

### Release Notes

Siehe [ReleaseNotes.md](./ReleaseNotes.md) für alle Informationen zu den neuesten Releases.

## Getting Started

Das Unterverzeichnis `erp-fd-communications/interactive` enthält eine React-Anwendung auf Basis von JSON Forms. Mit ihr lässt sich das Zusammenspiel der bereitgestellten Schemata ausprobieren und Testdaten generieren.

### Prerequisites

- Node.js (empfohlen Version 18 oder neuer) und npm
- Ein aktueller Browser für den lokalen Aufruf der Anwendung

### Installation

1. Repository klonen und in das Verzeichnis `erp-fd-communications/interactive` wechseln.
2. Abhängigkeiten installieren: `npm install`.
3. Optionale Anpassungen der Schemas in `erp-fd-communications/interactive/src` vornehmen.

## Usage

- Entwicklung: `npm start` starten und `http://localhost:3000` im Browser öffnen.
- Deployment: `npm run deploy` entsprechend der internen Vorgaben verwenden.

Für weitere Beispiele oder ausführliche Dokumentation verweisen wir auf die Unterordner dieses Repositories (z. B. `erp-fd-communications/examples.json`) oder auf begleitende Dokumentationen, sofern vorhanden.

## License

Copyright 2024-2025 gematik GmbH

Apache License, Version 2.0

See the [LICENSE](./LICENSE) for the specific language governing permissions and limitations under the License

## Additional Notes and Disclaimer from gematik GmbH

1. Copyright notice: Each published work result is accompanied by an explicit statement of the license conditions for use. These are regularly typical conditions in connection with open source or free software. Programs described/provided/linked here are free software, unless otherwise stated.
2. Permission notice: Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    1. The copyright notice (Item 1) and the permission notice (Item 2) shall be included in all copies or substantial portions of the Software.
    2. The software is provided "as is" without warranty of any kind, either express or implied, including, but not limited to, the warranties of fitness for a particular purpose, merchantability, and/or non-infringement. The authors or copyright holders shall not be liable in any manner whatsoever for any damages or other claims arising from, out of or in connection with the software or the use or other dealings with the software, whether in an action of contract, tort, or otherwise.
    3. The software is the result of research and development activities, therefore not necessarily quality assured and without the character of a liable product. For this reason, gematik does not provide any support or other user assistance (unless otherwise stated in individual cases and without justification of a legal obligation). Furthermore, there is no claim to further development and adaptation of the results to a more current state of the art.
3. Gematik may remove published results temporarily or permanently from the place of publication at any time without prior notice or justification.
4. Please note: Parts of this code may have been generated using AI-supported technology. Please take this into account, especially when troubleshooting, for security analyses and possible adjustments.

## Contact

This software is currently being tested to ensure its technical quality and legal compliance. Your feedback is highly valued.

If you find any issues or have any suggestions or comments, or if you see any other ways in which we can improve, please reach out to: ospo@gematik.de.
