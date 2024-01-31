# Card Directives

The following directives are used by Card components to identify content that maybe displayed within a Card component.

## CardContentDirective

Identifies content elements and content types. Three type are supported

- content
- image
- title

### Usage

```
import { NuverialCardContentDirective } from '@dsg/shared/ui/nuverial';

<div nuverialCardContentType="content">Content</div>
<img nuverialCardContentType="image" src="/image.png" alt="alt text" />
<div nuverialCardContentType="title">title</div>
```

### Usage
