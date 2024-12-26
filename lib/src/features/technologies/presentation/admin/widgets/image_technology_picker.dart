import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/core/utils/unit8list_extension.dart';
import 'package:portfolio/src/features/projects/domain/image_and_path.dart';

class ImageTechnologyPicker extends StatefulWidget {
  const ImageTechnologyPicker({
    required this.newImage,
    this.image,
    super.key,
  });

  final ImageAndPath? image;
  final void Function(String?) newImage;

  @override
  State<ImageTechnologyPicker> createState() => _ImageTechnologyPickerState();
}

class _ImageTechnologyPickerState extends State<ImageTechnologyPicker> {
  late ImageAndPath _image;

  @override
  void initState() {
    _image = widget.image ?? const ImageAndPath();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: ImageMemoryPicked(
        height: 100,
        width: 100,
        image: _image,
        onImageAdded: (newImage) {
          setState(
            () => _image = ImageAndPath(
              localImage: newImage.codeUnitsString,
            ),
          );
          widget.newImage(newImage.codeUnitsString);
        },
        deleteTap: () {
          setState(() => _image = const ImageAndPath());
          widget.newImage(null);
        },
      ),
    );
  }
}
