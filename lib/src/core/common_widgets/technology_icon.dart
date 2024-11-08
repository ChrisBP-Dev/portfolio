import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/wrap_network_image.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

class TechnologyIcon extends StatelessWidget {
  const TechnologyIcon({required this.technology, super.key, this.size});
  final Technology technology;
  final double? size;

  @override
  Widget build(BuildContext context) {
    return WrapNetworkImage(
      imageUrl: technology.imageUrl,
      height: size ?? 42,
      width: size ?? 42,
    );
  }
}
