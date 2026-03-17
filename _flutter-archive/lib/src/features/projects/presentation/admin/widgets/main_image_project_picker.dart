import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/image_memory_picked.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/core/utils/unit8list_extension.dart';
import 'package:portfolio/src/features/projects/domain/image_and_path.dart';

class MainImageProjectPicker extends StatefulWidget {
  const MainImageProjectPicker({
    required this.newImage,
    this.image,
    super.key,
  });

  final ImageAndPath? image;
  final void Function(String) newImage;

  @override
  State<MainImageProjectPicker> createState() => _MainImageProjectPickerState();
}

class _MainImageProjectPickerState extends State<MainImageProjectPicker> {
  late ImageAndPath _image;

  @override
  void initState() {
    _image = widget.image ?? const ImageAndPath();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveCenter(
      maxContentWidth: Breakpoint.mobile,
      child: SizedBox(
        height: 250,
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: ImageMemoryPicked(
            image: _image,
            onImageAdded: (newImage) {
              setState(
                () => _image =
                    _image.copyWith(localImage: newImage.codeUnitsString),
              );
              widget.newImage(newImage.codeUnitsString);
            },
            deleteTap: () {
              setState(() => _image = _image.copyWith(localImage: ''));
              widget.newImage('');
            },
          ),
        ),
      ),
    );
  }
}
