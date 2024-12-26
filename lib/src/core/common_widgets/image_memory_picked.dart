import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:portfolio/src/core/common_widgets/wrap_network_image.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/projects/domain/image_and_path.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ImageMemoryPicked extends StatelessWidget {
  const ImageMemoryPicked({
    required this.image,
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
  final ImageAndPath image;

  @override
  Widget build(BuildContext context) {
    final child = (!image.isEmpty).when(
      isTrue: () => image.hasLocalImage.when(
        isTrue: () => Image.memory(
          image.localImageCharCode!,
          fit: BoxFit.cover,
        ),
        isFalse: () => WrapNetworkImage(
          imageUrl: image.url!,
          width: width,
          height: height,
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
            Text(context.l10n.upload),
            Text(context.l10n.image),
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
              padding: (!image.isEmpty) ? null : const EdgeInsets.all(20),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: child,
              ),
            ),
          ),
          if (!image.isEmpty)
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
