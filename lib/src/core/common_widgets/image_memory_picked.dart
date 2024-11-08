import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:portfolio/src/core/common_widgets/wrap_network_image.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/unit8list_extension.dart';
import 'package:portfolio/src/localization/string_hardcoded.dart';

class ImageMemoryPicked extends StatelessWidget {
  const ImageMemoryPicked({
    required this.imageCharCode,
    required this.onImageAdded,
    super.key,
    this.width,
    this.height,
    this.deleteTap,
  });

  final double? width;
  final double? height;
  final void Function(Uint8List) onImageAdded;
  final VoidCallback? deleteTap;
  final Uint8List imageCharCode;

  @override
  Widget build(BuildContext context) {
    final child = imageCharCode.isNotEmpty.when(
      isTrue: () => imageCharCode.isvalidUrl.when(
        isTrue: () => WrapNetworkImage(
          imageUrl: imageCharCode.codeUnitsString,
          width: width,
          height: height,
          fit: BoxFit.cover,
        ),
        isFalse: () => Image.memory(
          imageCharCode,
          fit: BoxFit.cover,
        ),
      ),
      isFalse: () => FittedBox(
        fit: BoxFit.scaleDown,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.camera_alt_outlined,
              size: 35,
            ),
            gapH14,
            Text('Subir'.hardcoded),
            Text('imagen'.hardcoded),
          ],
        ),
      ),
    );
    return SizedBox(
      height: height,
      width: width,
      child: Stack(
        fit: StackFit.expand,
        children: [
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () async {
              final picker = ImagePicker();
              final image = await picker.pickImage(
                source: ImageSource.gallery,
                imageQuality: 65,
              );

              if (image != null) {
                onImageAdded.call(await image.readAsBytes());
              }
            },
            child: Container(
              width: width,
              height: height,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: context.getPrimaryColor()),
              ),
              padding:
                  imageCharCode.isNotEmpty ? null : const EdgeInsets.all(20),
              child: child,
            ),
          ),
          if (imageCharCode.isNotEmpty)
            Positioned(
              top: 10,
              right: 10,
              child: IconButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                ),
                color: Colors.white,
                icon: const Icon(Icons.delete),
                onPressed: deleteTap,
              ),
            ),
        ],
      ),
    );
  }
}
