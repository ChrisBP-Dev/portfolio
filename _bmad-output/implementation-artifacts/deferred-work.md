# Deferred Work

## Orphan images from failed edit-mode retries

**Source:** Adversarial review of tech-spec-orphan-image-cleanup (round 1, defer)

**Problem:** En edit mode, si `processImageSlot` sube una imagen nueva y luego `updateDoc` falla, el usuario puede reintentar con una imagen diferente. Si el segundo intento tiene éxito, `savedSuccessfully=true` bloquea el cleanup, pero la imagen del primer intento fallido queda huérfana en Storage (no referenciada por el documento final).

**Scope:** ProjectForm y TechnologyForm en edit mode. BlogForm no tiene este patrón porque las inline images se suben antes del save.

**Posible solución:** Comparar `sessionUploadedImages` contra las imágenes finales en el documento de Firestore después del save exitoso, y limpiar las que no estén referenciadas. Alternativamente, limpiar `sessionUploadedImages` en el catch de handleEditSubmit y re-acumular en el retry.

**Priority:** Low — requiere que el save falle DESPUÉS de que la imagen se suba (ventana de tiempo muy pequeña), Y que el usuario reintente con una imagen diferente.
